import mongodb from "mongodb";

import {
  authenticate,
  postSuccess,
  postFailure,
  comparePassword,
  encryptPassword,
	slackPostRequest,
	SLACK_HOOK,
	SlackTitle
} from "../../utils/utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  ALLOWABLE_TIME_FOR_AUTH_ATTEMPTS,
  MAX_AUTH_ATTEMPTS
} from "./../../constants";

export const changePass = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Changing pass...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const dbo = db.db(DATABASE_NAME);

      const { pass } = findRes;

      const obj = postReq.body;

      const { currPass, newPass1, newPass2 } = obj;

      const setNewPass = (err: any, isPasswordMatch: any) => {
        if (err) {
          console.log(err);
          return;
        }

        const attemptDate = new Date();

        if (isPasswordMatch === false) {
          console.log("Incorrect password");

          let authAttempts = findRes.authAttempts ? findRes.authAttempts : [];

          authAttempts.push(attemptDate);
          authAttempts = authAttempts.filter((attempt: any) => {
            return (
              new Date(attemptDate).getTime() - attempt.getTime() <
              ALLOWABLE_TIME_FOR_AUTH_ATTEMPTS
            );
          });

          const lockedDate =
            authAttempts != null && authAttempts.length >= MAX_AUTH_ATTEMPTS
              ? attemptDate
              : null;

          dbo
            .collection(DATABASE_COLLECTION.USERS_COLLECTION)
            .updateOne(
              { _id: findRes._id },
              { $set: { lockedDate, authAttempts } }
            )
            .then(() => {
              db.close();
              postFailure(
                postRes,
                lockedDate
                  ? STATUS_MESSAGE.ACCOUNT_LOCKED
                  : STATUS_MESSAGE.INCORRECT_CRED
              );
            });
        } else if (isPasswordMatch === true) {
          if (newPass1 !== newPass2) {
            db.close();
            postFailure(postRes, STATUS_MESSAGE.PASSWORDS_NOT_SAME);
            return;
          } else {
            const updatePass = (err: any, hash: any) => {
              if (err) {
                console.log(err);
                return;
              }

              if (!hash) {
                return;
              }

              const newPass = hash;

              dbo
                .collection(DATABASE_COLLECTION.USERS_COLLECTION)
                .updateOne({ _id: findRes._id }, { $set: { pass: newPass } });

              console.log("Pass updated");
              db.close();
              postSuccess(postRes, {});
            };

            encryptPassword(newPass1, updatePass);
          }
        }
      };

      const {} = obj;

      comparePassword(currPass, pass, setNewPass);
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: changePass
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
