import mongodb from "mongodb";

import { SLACK_HOOK, SlackTitle, authenticate, postSuccess, slackPostRequest } from "../../utils/utils";
import { retrieveSubscriptionBrands } from "./../../subscriptions";

const ObjectId = mongodb.ObjectID;

export const getSubscriptionBrands = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription brand...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const query = postReq.query;

      const subscriptionCategory = query.subscriptionCategory;
      const subscriptionBrands = retrieveSubscriptionBrands(
        subscriptionCategory
      );

      const defaultSubscriptionBrand = subscriptionBrands[0];

      db.close();
      postSuccess(postRes, {
        subscriptionBrands,
        defaultSubscriptionBrand
      });
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: getSubscriptionBrands
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
