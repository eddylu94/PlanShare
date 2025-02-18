import mongodb from "mongodb";

import {
  SLACK_HOOK,
  SlackTitle,
  authenticate,
  postSuccess,
  slackPostRequest
} from "../../utils/utils";
import { DATABASE_NAME, DATABASE_COLLECTION } from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const editSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Editing subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { _id, username } = findRes;

      const { subscriptionData } = obj;

      const { subscriptionId } = subscriptionData;

      Object.assign(subscriptionData, {
        username,
        editedDate: new Date(),
        price: parseFloat(subscriptionData.price),
        subscriptionUrl: subscriptionData.subscriptionUrl,
        subscriptionBrandName:
          subscriptionData.subscriptionBrand &&
          subscriptionData.subscriptionBrand.name
      });

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .updateOne(
          { _id: new ObjectId(subscriptionId) },
          { $set: { ...subscriptionData } }
        )
        .then(() => {
          console.log("Subscription updated:", subscriptionId);

          const supportingText = `
						\`\`\`
						User ID: ${_id}
						Listing brand: ${subscriptionData.subscriptionBrand &&
              subscriptionData.subscriptionBrand.name}
						\`\`\`
					`;

          slackPostRequest(
            SLACK_HOOK.POSTS,
            SlackTitle.LISTING_EDITED,
            supportingText
          );

          db.close();
          postSuccess(postRes, {
            subscriptionId
          });
        });
    })
    .catch(err => {
      console.log(err);

      const supportingText = `
				\`\`\`
				Request: editSubscription
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;

      slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
