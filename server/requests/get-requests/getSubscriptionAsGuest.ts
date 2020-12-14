import mongodb from "mongodb";

import {
  authenticate,
  getDomain,
  postSuccess,
  postFailure,
  ERROR_TYPE,
  SLACK_HOOK,
  slackPostRequest
} from "./../../utils";
import { retrieveOrganizationByDomain } from "./../../organizations";
import {
  MONGO_URL,
  MONGO_PREREQUISITIES,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SUBSCRIPTION_STATUS
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const getSubscriptionAsGuest = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription as guest...");

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

      const postRequestData = {
        text: JSON.stringify({
          request: "getSubscriptionsAsGuest",
          errorType: ERROR_TYPE.SERVER,
          errorMessage,
          error: connectErr
        })
      };
      slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

      return;
    }

    const { subscriptionId } = postReq.query;

    console.log(postReq.query);

    console.log(subscriptionId);

    const dbo = db.db(DATABASE_NAME);

    return dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .findOne(
        { _id: new ObjectId(subscriptionId) },
        (findErr, subscriptionFindRes) => {
          if (subscriptionFindRes.organization) {
            console.log(
              "User does not belong in organization of selected subscription"
            );
            db.close();
            postFailure(
              postRes,
              STATUS_MESSAGE.USER_NOT_MEMBER_OF_ORGANIZATION
            );
            return;
          }

          db.close();
          postSuccess(postRes, {
            subscriptionData: subscriptionFindRes
          });
        }
      );
  });
};
