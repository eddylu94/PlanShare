import mongodb from "mongodb";

import { SLACK_HOOK, SlackTitle, authenticate, postSuccess, slackPostRequest } from "./../../utils";
import { DATABASE_NAME, DATABASE_COLLECTION } from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const deleteSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Deleting subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { subscriptionId } = obj;

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .deleteOne({ _id: new ObjectId(subscriptionId) })
        .then(() => {
          console.log("Subscription deleted:", subscriptionId);

          db.close();
          postSuccess(postRes, {});
        });
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: deleteSubscription
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
