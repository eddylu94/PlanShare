import mongodb from "mongodb";

import { EMAIL_SERVICE_EMAIL, transporter } from "./../../email-service";
import {
  generateConfirmationCode,
  postSuccess,
  postFailure,
  SLACK_HOOK,
  slackPostRequest,
	SlackTitle
} from "../../utils/utils";
import {
  TITLE,
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  ACCOUNT_STATUS
} from "./../../constants";

export const addEmail = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Verifying email...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

			const supportingText = `
				\`\`\`
				Request: addEmail
				Description: ${errorMessage}
				Error message: ${connectErr.message}
				\`\`\`
			`;

			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);

      return;
    }

    const headerAuthorization = postReq.headers.authorization;
    const authKey = headerAuthorization.replace("Bearer ", "");

    const dbo = db.db(DATABASE_NAME);
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne(
        { email: obj.email, status: ACCOUNT_STATUS.LIVE },
        (findErr, findRes) => {
          if (findRes) {
            console.log("Email already exists");
            db.close();
            postFailure(postRes, STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED);
            return;
          }

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
									\`\`\`
									Request: addEmail
									Description: ${errorMessage}
									Error message: ${findErr.message}
									\`\`\`
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

              if (findRes.status === ACCOUNT_STATUS.LIVE) {
                console.log("Email already validated");
                db.close();
                postSuccess(postRes, {});
                return;
              }

              if (findRes.email) {
                console.log("Email already added");
                db.close();
                postSuccess(postRes, {});
                return;
              }

              const email = obj.email;

              const confirmationCode = generateConfirmationCode();

              const dbo = db.db(DATABASE_NAME);
              dbo
                .collection(DATABASE_COLLECTION.USERS_COLLECTION)
                .updateOne(
                  { _id: findRes._id },
                  { $set: { email, confirmationCode } }
                )
                .then(() => {
                  console.log("Email added:", email);

									const supportingText = `
										\`\`\`
										User ID: ${findRes._id}
										\`\`\`
									`;
									
									slackPostRequest(SLACK_HOOK.SIGNUPS, SlackTitle.EMAIL_ADDED, supportingText);

                  db.close();
                  postSuccess(postRes, {});

                  const username = findRes.username;

                  const mailSubject = `Welcome to ${TITLE}`;
                  const mailMessage = `Thank you for registering for ${TITLE}!<br /><br />Your username is:<br /><span style="font-weight: bold;">${username}</span><br /><br />Your confirmation code is:<br /><span style="font-weight: bold;">${confirmationCode}</span>`;

                  const mailOptions = {
                    from: EMAIL_SERVICE_EMAIL,
                    to: email,
                    subject: mailSubject,
                    html: mailMessage
                  };

                  let attempts = 0;
                  const SEND_EMAIL_MAX_NUMBER_OF_ATTEMPTS = 5;

                  const sendEmail = () => {
                    attempts++;
                    transporter.sendMail(mailOptions, function(sendErr, info) {
                      if (sendErr) {
                        console.log("Error sending email");
                        console.log(sendErr);
                        if (attempts <= SEND_EMAIL_MAX_NUMBER_OF_ATTEMPTS) {
                          sendEmail();
                        }
                      } else {
                        console.log("Email sent: " + info.response);
                      }
                    });
                  };

                  sendEmail();
                })
                .catch((error: any) => {
                  console.log(error);
                });
            });
        }
      );
  });
};
