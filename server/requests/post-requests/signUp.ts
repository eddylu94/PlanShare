import mongodb from "mongodb";

import {
  encryptPassword,
  generateAuthToken,
  generateConfirmationCode,
  postFailure,
  postSuccess,
  SLACK_HOOK,
  slackPostRequest,
  SlackTitle
} from "../../utils/utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  ACCOUNT_STATUS,
  TITLE
} from "./../../constants";
import { EMAIL_SERVICE_EMAIL, transporter } from "../../email-service";

export const signUp = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Signing up...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);
      db.close();
      postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

      const supportingText = `
				\`\`\`
				Request: signUp
				Description: ${errorMessage}
				Error message: ${connectErr.message}
				\`\`\`
			`;

      slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);

      return;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user already exists
    const username = obj.username.toLocaleLowerCase();
    const email = obj.email.toLocaleLowerCase();
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ $or: [{ username }, { email }] }, (findErr, findRes) => {
        if (findErr) {
          const errorMessage = "Error finding record";
          console.log(errorMessage);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

          const supportingText = `
						\`\`\`
						Request: signUp
						Description: ${errorMessage}
						Error message: ${findErr.message}
						\`\`\`
					`;

          slackPostRequest(
            SLACK_HOOK.ERRORS,
            SlackTitle.NEW_ERROR,
            supportingText
          );

          return;
        }

        if (!!findRes) {
          const existingField =
            findRes.username === username ? "username" : "email";
          console.log(
            `${existingField} already exists:`,
            existingField === "username" ? username : email
          );
          db.close();
          postFailure(
            postRes,
            existingField === "username"
              ? STATUS_MESSAGE.USERNAME_ALREADY_EXISTS
              : STATUS_MESSAGE.EMAIL_ALREADY_EXISTS
          );
          return;
        }

        const authToken = generateAuthToken();
        Object.assign(obj, {
          joinedDate: new Date().getTime(),
          authTokens: [authToken],
          status: ACCOUNT_STATUS.PENDING_VERIFICATION
        });

        const plainPass = obj.pass;
        delete obj.pass;

        const addUser = (err: any, hash: any) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!hash) {
            return;
          }
          obj.pass = hash;

          const confirmationCode = generateConfirmationCode();
          obj.confirmationCode = confirmationCode;

          // Insert user into database
          dbo
            .collection(DATABASE_COLLECTION.USERS_COLLECTION)
            .insertOne(obj, (insertErr, insertRes) => {
              if (insertErr) {
                const errorMessage = "Error inserting record";
                console.log(errorMessage);
                db.close();
                postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

                const supportingText = `
									\`\`\`
									Request: signUp
									Description: ${errorMessage}
									Error message: ${insertErr.message}
									\`\`\`
								`;

                slackPostRequest(
                  SLACK_HOOK.ERRORS,
                  SlackTitle.NEW_ERROR,
                  supportingText
                );

                return;
              }

              console.log("User created:", username);

              const supportingText = `
								\`\`\`
								User ID: ${insertRes.insertedId}
								Username: ${username}
								\`\`\`
							`;

              slackPostRequest(
                SLACK_HOOK.SIGNUPS,
                SlackTitle.NEW_USER_REGISTERED,
                supportingText
              );

              console.log("Email added:", email);

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

              db.close();
              postRes.json({
                statusCode: STATUS_CODE.SUCCESS,
                body: {
                  userId: insertRes.insertedId,
                  auth: authToken.key,
                  username: obj.username
                }
              });
            });
        };

        encryptPassword(plainPass, addUser);
      });
  });
};
