import mongodb from "mongodb";

import {
  postSuccess,
  ERROR_TYPE,
  SLACK_HOOK,
  slackPostRequest
} from "./../../utils";
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
  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

      const postRequestData = {
        text: JSON.stringify({
          request: "getListingTypes",
          errorType: ERROR_TYPE.SERVER,
          errorMessage,
          error: connectErr
        })
      };
      slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

      return;
    }

    const listingTypes = [
      // { type: LISTING_TYPE.ALL, name: "All" },
      {
        type: LISTING_TYPE.SUBSCRIPTION,
        name: "Subscriptions",
        icon: "https://planshare.io/subscriptions_icon.png"
      },
      {
        type: LISTING_TYPE.FOR_SALE,
        name: "Group Orders",
        icon: "https://planshare.io/for_sale_icon.png"
      }
      // {
      //   type: LISTING_TYPE.HOUSING,
      //   name: "Housing",
      //   icon: "https://planshare.io/housing_icon.png"
      // }
    ];

    db.close();
    postSuccess(postRes, { listingTypes });
  });
};
