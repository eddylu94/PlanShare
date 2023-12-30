import mongodb from "mongodb";

import { SLACK_HOOK, SlackTitle, authenticate, postSuccess, slackPostRequest } from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  SUBSCRIPTION_STATUS
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const archiveSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Archiving subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { subscriptionId } = obj;

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .updateOne(
          { _id: new ObjectId(subscriptionId) },
          { $set: { status: SUBSCRIPTION_STATUS.DELISTED } }
        )
        .then(() => {
          console.log("Subscription archived:", subscriptionId);

          db.close();
          postSuccess(postRes, {});
        });
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: archiveSubscription
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
