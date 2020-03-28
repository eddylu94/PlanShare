import mongodb from "mongodb";

import { EMAIL_SERVICE_EMAIL, transporter } from "./../email-service";
import { retrieveOrganizationById } from "./../organizations";
import {
  IPendingEmail,
  authenticate,
  generateConfirmationCode,
  generateAuthToken
} from "./../utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES
} from "./../constants";

export const signUp = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Signing up...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      console.log("Connection error");
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.FAILURE,
        statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
      });
      throw connectErr;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user already exists
    const email = obj.email;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ email }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
          throw findErr;
        }

        if (!!findRes) {
          console.log("Email address already exists:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.EMAIL_ALREADY_EXISTS
          });
          return;
        }

        const confirmationCode = generateConfirmationCode();

        const authToken = generateAuthToken();
        Object.assign(obj, {
          joinedDate: new Date().getTime(),
          authTokens: [authToken],
          emails: [],
          pendingEmails: [
            {
              email,
              confirmationCode
            }
          ]
        });

        // Insert user into database
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .insertOne(obj, (insertErr, insertRes) => {
            if (insertErr) {
              console.log("Error inserting record");
              db.close();
              postRes.json({
                statusCode: STATUS_CODE.FAILURE,
                statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
              });
              throw insertErr;
            }

            console.log("User created:", email);
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.SUCCESS,
              body: {
                userId: insertRes.insertedId,
                auth: authToken.key
              }
            });

            const mailSubject = "Welcome to Project 3632";
            const mailMessage = `Thank you for registering for Project 3632!<br /><br />Your confirmation code is:<br /><span style="font-weight: bold;">${confirmationCode}</span>`;

            const mailOptions = {
              from: EMAIL_SERVICE_EMAIL,
              to: email,
              subject: mailSubject,
              html: mailMessage
            };

            transporter.sendMail(mailOptions, function(sendErr, info) {
              if (sendErr) {
                console.log("Error sending email");
                throw sendErr;
              } else {
                console.log("Email sent: " + info.response);
              }
            });
          });
      });
  });
};

export const login = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Logging in...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      console.log("Connection error");
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.FAILURE,
        statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
      });
      throw connectErr;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user exists
    const { email, pass } = obj;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ email }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
          throw findErr;
        }

        if (!findRes) {
          console.log("Email address does not exist:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.INCORRECT_CRED
          });
          return;
        }

        if (findRes.pass !== pass) {
          console.log("Incorrect password:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.INCORRECT_CRED
          });
          return;
        }

        const userId = findRes._id;

        const authToken = generateAuthToken();

        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .updateOne({ _id: findRes._id }, { $push: { authTokens: authToken } })
          .then(() => {
            console.log("User logged in:", email);
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.SUCCESS,
              body: {
                userId: userId.toString(),
                auth: authToken.key
              }
            });
          });
      });
  });
};

export const verifyEmail = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Verifying email...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connerErr, db) => {
    if (connerErr) throw connerErr;

    const headerAuthorization = postReq.headers.authorization;
    const authKey = headerAuthorization.replace("Bearer ", "");

    const dbo = db.db(DATABASE_NAME);
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ "authTokens.key": authKey }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
          throw findErr;
        }

        if (!findRes) {
          console.log("Unable to find account for validation");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          });
          return;
        }

        const email: string = findRes.email;
        const pendingEmails: IPendingEmail[] = findRes.pendingEmails;

        if (findRes.emails.indexOf(email) >= 0) {
          console.log("Email already validated");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            statusMessage: STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED
          });
          return;
        }

        const pendingEmail = pendingEmails.find(
          pendingEmail => pendingEmail.email === email
        );
        const confirmationCode = pendingEmail && pendingEmail.confirmationCode;

        if (!confirmationCode) {
          console.log("Unable to find pending account for validation");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          });
          return;
        }

        if (confirmationCode !== obj.validationCode) {
          console.log("Incorrect validation code");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.INCORRECT_VALIDATION_CODE
          });
          return;
        }

        const dbo = db.db(DATABASE_NAME);

        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .updateOne({ _id: findRes._id }, { $push: { emails: email } })
          .then(() => {
            dbo
              .collection(DATABASE_COLLECTION.USERS_COLLECTION)
              .updateOne(
                { _id: findRes._id },
                { $pull: { pendingEmails: { email: email } } }
              )
              .then(() => {
                console.log("Email validated:", email);
                db.close();
                postRes.json({
                  statusCode: STATUS_CODE.SUCCESS
                });
              });
          });
      });
  });
};

export const createSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Creating subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { firstName } = findRes;

      const { subscriptionData } = obj;

      const organization = retrieveOrganizationById(
        subscriptionData.organizationId
      );

      Object.assign(subscriptionData, {
        userId: findRes._id,
        firstName,
        organization,
        createdDate: new Date()
      });

      Object.assign(subscriptionData, {
        numberOfPeople: parseInt(subscriptionData.numberOfPeople),
        price: parseFloat(subscriptionData.price)
      });

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .insertOne(subscriptionData, (insertErr, insertRes) => {
          if (insertErr) {
            console.log("Error inserting record");
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.FAILURE,
              statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
            });
            throw insertErr;
          }

          const subscriptionId = insertRes.insertedId;

          console.log("Subscription created:", subscriptionId);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            body: {
              subscriptionId
            }
          });
        });
    })
    .catch(err => {
      console.log(err);
    });
};
