import mongodb from "mongodb";

import { postSuccess } from "./../../utils";
import {
  MONGO_URL,
  MONGO_PREREQUISITIES,
  LISTING_TYPE
} from "./../../constants";

export const getListingTypes = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connerErr, db) => {
    if (connerErr) throw connerErr;

    const listingTypes = [
      // { type: LISTING_TYPE.ALL, name: "All" },
      { type: LISTING_TYPE.SUBSCRIPTION, name: "Subscriptions" },
      { type: LISTING_TYPE.FOR_SALE, name: "For Sale" },
      { type: LISTING_TYPE.HOUSING, name: "Housing" }
    ];

    db.close();
    postSuccess(postRes, { listingTypes });
  });
};
