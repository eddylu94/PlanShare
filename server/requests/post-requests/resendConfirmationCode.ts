import mongodb from "mongodb";

import { EMAIL_SERVICE_EMAIL, transporter } from "./../../email-service";
import {
  generateConfirmationCode,
  postSuccess,
  postFailure,
  ERROR_TYPE,
  SLACK_HOOK,
  slackPostRequest
} from "./../../utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  ACCOUNT_STATUS
} from "./../../constants";

export const resendConfirmationCode = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Sending new confirmation code...");

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

      const postRequestData = {
        text: JSON.stringify({
          request: "resendConfirmationCode",
          errorType: ERROR_TYPE.SERVER,
          errorMessage,
          error: connectErr
        })
      };
      slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

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

          const postRequestData = {
            text: JSON.stringify({
              request: "resendConfirmationCode",
              errorType: ERROR_TYPE.SERVER,
              errorMessage,
              error: findErr
            })
          };
          slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

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

        const email = findRes.email;

        const confirmationCode = generateConfirmationCode();

        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .updateOne({ _id: findRes._id }, { $set: { confirmationCode } })
          .then(() => {
            console.log("New confirmation code sent:", email);
            db.close();
            postSuccess(postRes, {});

            const mailSubject = `Verify your email`;
            const mailMessage = `Here is your new confirmation code:<br /><span style="font-weight: bold;">${confirmationCode}</span>`;

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
  });
};
