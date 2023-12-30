import mongodb from "mongodb";

import {
  postSuccess,
  postFailure,
  ERROR_TYPE,
  SLACK_HOOK,
  slackPostRequest,
	SlackTitle
} from "./../../utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  ACCOUNT_STATUS,
  ACCOUNT_VALIDATE_LOCK_PERIOD,
  ALLOWABLE_TIME_FOR_VALIDATE_ATTEMPTS,
  MAX_VALIDATE_ATTEMPTS
} from "./../../constants";

export const verifyEmail = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Verifying email...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";

			const supportingText = `
				Request: verifyEmail
				Description: ${errorMessage}
				Error message: ${connectErr.message}
			`;

			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);

      return;
    }

    const headerAuthorization = postReq.headers.authorization;
    const authKey = headerAuthorization.replace("Bearer ", "");

    const dbo = db.db(DATABASE_NAME);
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ "authTokens.key": authKey }, (findErr, findRes) => {
        if (findErr) {
          const errorMessage = "Error finding record";
          console.log(errorMessage);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

					const supportingText = `
						Request: verifyEmail
						Description: ${errorMessage}
						Error message: ${findErr.message}
					`;
		
					slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);

          return;
        }

        if (!findRes) {
          console.log("Unable to find account for validation");
          db.close();
          postFailure(
            postRes,
            STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          );
          return;
        }

        const email: string = findRes.email;

        if (findRes.status === ACCOUNT_STATUS.LIVE) {
          console.log("Email already validated");
          db.close();
          postSuccess(postRes, {});
          return;
        }

        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .findOne(
            { email, status: ACCOUNT_STATUS.LIVE },
            (findExistingProfileErr, findExistingProfileRes) => {
              if (findExistingProfileRes) {
                console.log("Email already exists");
                db.close();
                postFailure(postRes, STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED);
                return;
              }

              const attemptDate = new Date();

              const findResValidationLockedDate = findRes.validationLockedDate;
              if (
                findResValidationLockedDate &&
                new Date(attemptDate).getTime() -
                  findResValidationLockedDate.getTime() <
                  ACCOUNT_VALIDATE_LOCK_PERIOD
              ) {
                console.log("Account validation is locked");
                db.close();
                postFailure(
                  postRes,
                  STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
                );
                return;
              }

              const confirmationCode = findRes.confirmationCode;

              if (!confirmationCode) {
                console.log("Unable to find pending account for validation");
                db.close();
                postFailure(
                  postRes,
                  STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
                );
                return;
              }

              if (confirmationCode !== obj.validationCode) {
                console.log("Incorrect validation code");

                let validateAttempts = findRes.validateAttempts
                  ? findRes.validateAttempts
                  : [];

                validateAttempts.push(attemptDate);
                validateAttempts = validateAttempts.filter((attempt: any) => {
                  return (
                    new Date(attemptDate).getTime() - attempt.getTime() <
                    ALLOWABLE_TIME_FOR_VALIDATE_ATTEMPTS
                  );
                });

                const validateLockedDate =
                  validateAttempts != null &&
                  validateAttempts.length >= MAX_VALIDATE_ATTEMPTS
                    ? attemptDate
                    : null;

                const dbo = db.db(DATABASE_NAME);
                dbo
                  .collection(DATABASE_COLLECTION.USERS_COLLECTION)
                  .updateOne(
                    { _id: findRes._id },
                    { $set: { validateLockedDate, validateAttempts } }
                  )
                  .then(() => {
                    db.close();
                    postFailure(
                      postRes,
                      validateLockedDate
                        ? STATUS_MESSAGE.ACCOUNT_VALIDATION_LOCKED
                        : STATUS_MESSAGE.INCORRECT_VALIDATION_CODE
                    );
                  });

                return;
              }

              const dbo = db.db(DATABASE_NAME);
              dbo
                .collection(DATABASE_COLLECTION.USERS_COLLECTION)
                .updateOne(
                  { _id: findRes._id },
                  { $set: { status: ACCOUNT_STATUS.LIVE } }
                )
                .then(() => {
                  console.log("Email validated:", email);
                  db.close();
                  postSuccess(postRes, {});
                })
                .catch((error: any) => {
                  console.log(error);
                });
            }
          );
      });
  });
};
