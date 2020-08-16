import mongodb from "mongodb";

import {
  postSuccess,
  ERROR_TYPE,
  SLACK_HOOK,
  slackPostRequest
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

      const postRequestData = {
        text: JSON.stringify({
          request: "getSubscriptionCategories",
          errorType: ERROR_TYPE.SERVER,
          errorMessage,
          error: connectErr
        })
      };
      slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

      return;
    }

    const defaultSubscriptionCategory = subscriptionCategories[0];

    db.close();
    postSuccess(postRes, {
      subscriptionCategories: subscriptionCategories,
      defaultSubscriptionCategory
    });
  });
};
