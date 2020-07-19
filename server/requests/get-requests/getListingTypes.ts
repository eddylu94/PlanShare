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
      {
        type: LISTING_TYPE.SUBSCRIPTION,
        name: "Subscriptions",
        icon: "https://planshare.io/subscriptions_icon.png"
      },
      {
        type: LISTING_TYPE.FOR_SALE,
        name: "For Sale",
        icon: "https://planshare.io/for_sale_icon.png"
      },
      {
        type: LISTING_TYPE.HOUSING,
        name: "Housing",
        icon: "https://planshare.io/housing_icon.png"
      }
    ];

    db.close();
    postSuccess(postRes, { listingTypes });
  });
};
