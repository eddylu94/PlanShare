import mongodb from "mongodb";

import {
  comparePassword,
  generateAuthToken,
  postSuccess,
  postFailure
} from "./../../utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  MAX_AUTH_ATTEMPTS,
  ALLOWABLE_TIME_FOR_AUTH_ATTEMPTS,
  ACCOUNT_LOCK_PERIOD
} from "./../../constants";

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
      postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
      throw connectErr;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user exists
    const username = obj.username.toLocaleLowerCase();
    const { pass } = obj;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ username }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
          throw findErr;
        }

        if (!findRes) {
          console.log("Username does not exist:", username);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.INCORRECT_CRED);
          return;
        }

        const attemptDate = new Date();

        const findResLockedDate = findRes.lockedDate;
        if (
          findResLockedDate &&
          new Date(attemptDate).getTime() - findResLockedDate.getTime() <
            ACCOUNT_LOCK_PERIOD
        ) {
          console.log("Account is locked:", username);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.ACCOUNT_LOCKED);
          return;
        }

        const authenticateUser = (err: any, isPasswordMatch: any) => {
          if (err) {
            console.log(err);
            return;
          }

          if (isPasswordMatch === false) {
            console.log("Incorrect password:", username);

            let authAttempts = findRes.authAttempts ? findRes.authAttempts : [];

            authAttempts.push(attemptDate);
            authAttempts = authAttempts.filter((attempt: any) => {
              return (
                new Date(attemptDate).getTime() - attempt.getTime() <
                ALLOWABLE_TIME_FOR_AUTH_ATTEMPTS
              );
            });

            const lockedDate =
              authAttempts && authAttempts.length >= MAX_AUTH_ATTEMPTS
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
            const userId = findRes._id;
            const { firstName } = findRes;

            const authToken = generateAuthToken();

            dbo
              .collection(DATABASE_COLLECTION.USERS_COLLECTION)
              .updateOne(
                { _id: findRes._id },
                { $push: { authTokens: authToken } }
              )
              .then(() => {
                console.log("User logged in:", username);
                db.close();
                postSuccess(postRes, {
                  userId: userId.toString(),
                  auth: authToken.key,
                  firstName
                });
              });
          }
        };

        comparePassword(pass, findRes.pass, authenticateUser);
      });
  });
};
