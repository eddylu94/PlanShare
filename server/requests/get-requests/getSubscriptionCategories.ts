import mongodb from "mongodb";

import { postSuccess } from "./../../utils";
import { subscriptionCategories } from "./../../subscriptions";
import { MONGO_URL, MONGO_PREREQUISITIES } from "./../../constants";

export const getSubscriptionCategories = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connerErr, db) => {
    if (connerErr) throw connerErr;

    const defaultSubscriptionCategory = subscriptionCategories[0];

    db.close();
    postSuccess(postRes, {
      subscriptionCategories: subscriptionCategories,
      defaultSubscriptionCategory
    });
  });
};
