import mongodb from "mongodb";

import { EMAIL_SERVICE_EMAIL, transporter } from "./../../email-service";
import {
  encryptPassword,
  generateAuthToken,
  postFailure,
  postSuccess,
  generateConfirmationCode,
  ERROR_TYPE,
  SLACK_HOOK,
  slackPostRequest
} from "./../../utils";
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

      const postRequestData = {
        text: JSON.stringify({
          request: "signUp",
          errorType: ERROR_TYPE.SERVER,
          errorMessage,
          error: connectErr
        })
      };
      slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

      return;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user already exists
    const username = obj.username.toLocaleLowerCase();
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ username }, (findErr, findRes) => {
        if (findErr) {
          const errorMessage = "Error finding record";
          console.log(errorMessage);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

          const postRequestData = {
            text: JSON.stringify({
              request: "signUp",
              errorType: ERROR_TYPE.SERVER,
              errorMessage,
              error: findErr
            })
          };
          slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

          return;
        }

        if (!!findRes) {
          console.log("Username already exists:", username);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.USERNAME_ALREADY_EXISTS);
          return;
        }

        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .findOne(
            { email: obj.email, status: ACCOUNT_STATUS.LIVE },
            (findErr, findRes) => {
              if (findRes) {
                console.log("Email already exists");
                db.close();
                postFailure(postRes, STATUS_MESSAGE.EMAIL_ALREADY_EXISTS);
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

                      const postRequestData = {
                        text: JSON.stringify({
                          request: "signUp",
                          errorType: ERROR_TYPE.SERVER,
                          errorMessage,
                          error: insertErr
                        })
                      };
                      slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

                      return;
                    }

                    console.log("User created:", username);
                    db.close();
                    postRes.json({
                      statusCode: STATUS_CODE.SUCCESS,
                      body: {
                        userId: insertRes.insertedId,
                        auth: authToken.key,
                        username: obj.username
                      }
                    });

                    const email = obj.email;

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
                      transporter.sendMail(mailOptions, function(
                        sendErr,
                        info
                      ) {
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
                  });
              };

              encryptPassword(plainPass, addUser);
            }
          );
      });
  });
};
