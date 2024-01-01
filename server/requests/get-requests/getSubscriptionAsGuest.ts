import mongodb from "mongodb";

import {
  postSuccess,
  postFailure,
  SLACK_HOOK,
  slackPostRequest,
	SlackTitle
} from "../../utils/utils";
import {
  MONGO_URL,
  MONGO_PREREQUISITIES,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
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

			const supportingText = `
				Request: getSubscriptionsAsGuest
				Description: ${errorMessage}
				Error message: ${connectErr.message}
			`;

			slackPostRequest(
				SLACK_HOOK.ERRORS,
				SlackTitle.NEW_ERROR,
				supportingText,
			);

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
              STATUS_MESSAGE.USER_NOT_MEMBER_OF_ORGANIZATION,
              { organization: subscriptionFindRes.organization }
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
