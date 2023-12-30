import mongodb from "mongodb";

import {
  postSuccess,
  SLACK_HOOK,
  slackPostRequest,
	SlackTitle
} from "./../../utils";
import { subscriptionCategories } from "./../../subscriptions";
import { MONGO_URL, MONGO_PREREQUISITIES } from "./../../constants";

export const getSubscriptionCategories = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

			const supportingText = `
				Request: getSubscriptionCategories
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

    const defaultSubscriptionCategory = subscriptionCategories.find(
      category => category.subscriptionCategoryId === "MOBILE_SERVICE"
    );

    db.close();
    postSuccess(postRes, {
      subscriptionCategories: subscriptionCategories,
      defaultSubscriptionCategory
    });
  });
};
