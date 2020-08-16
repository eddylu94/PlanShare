import mongodb from "mongodb";

import {
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

export const getValidationEmail = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving validation email...");

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

      const postRequestData = {
        text: JSON.stringify({
          request: "getValidationEmail",
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
              request: "getValidationEmail",
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
