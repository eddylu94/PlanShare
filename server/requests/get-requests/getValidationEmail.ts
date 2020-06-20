import mongodb from "mongodb";

import { postSuccess, postFailure } from "./../../utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  ACCOUNT_STATUS
} from "./../../constants";

export const getValidationEmail = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving validation email...");

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
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
          throw findErr;
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
        }

        console.log("Email retrieved:", email);
        db.close();
        postSuccess(postRes, { email });
      });
  });
};
