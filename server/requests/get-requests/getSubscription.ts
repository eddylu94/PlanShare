import mongodb from "mongodb";

import {
  authenticate,
  postSuccess,
  postFailure,
  SLACK_HOOK,
  SlackTitle,
  slackPostRequest
} from "../../utils/utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SUBSCRIPTION_STATUS
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const getSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { subscriptionId } = postReq.query;

      console.log(postReq.query);

      console.log(subscriptionId);

      const dbo = db.db(DATABASE_NAME);

      return dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .findOne(
          { _id: new ObjectId(subscriptionId) },
          (_findErr, subscriptionFindRes) => {
            if (
              !(
                findRes._id.toString() ===
                  subscriptionFindRes.userId.toString() ||
                subscriptionFindRes.status === SUBSCRIPTION_STATUS.ACTIVE
              )
            ) {
              console.log("User does not have access to subscription");
              db.close();
              postFailure(
                postRes,
                STATUS_MESSAGE.USER_REQUIRES_ACCESS_FOR_SUBSCRIPTION
              );
              return;
            }

            db.close();
            postSuccess(postRes, {
              subscriptionData: subscriptionFindRes
            });
          }
        );
    })
    .catch(err => {
      console.log(err);

      const supportingText = `
				\`\`\`
				Request: getSubscription
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;

      slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
