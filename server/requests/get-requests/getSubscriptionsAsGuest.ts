import mongodb from "mongodb";

import {
  postSuccess,
  postFailure,
  ERROR_TYPE,
  SLACK_HOOK,
  slackPostRequest
} from "./../../utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  SORT_BY,
  SUBSCRIPTION_STATUS
} from "./../../constants";
import { Sponsors } from "../../sponsors";

export const getSubscriptionsAsGuest = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions as guest...");
  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

      const postRequestData = {
        text: JSON.stringify({
          request: "getSubscriptionsAsGuest",
          errorType: ERROR_TYPE.SERVER,
          errorMessage,
          error: connectErr
        })
      };
      slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

      return;
    }

    const { t, sc, gs, sb, da, p } = postReq.query;

    const subscriptionCategories = sc.split(",");

    let [minGroupSize, maxGroupSize] = gs
      ? gs.split(",").map((val: string) => parseInt(val))
      : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

    let [minPrice, maxPrice] = p
      ? p.split(",").map((val: string) => parseInt(val))
      : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

    const dbo = db.db(DATABASE_NAME);

    const currentDate = new Date();
    const oldestDate = new Date(
      new Date().setDate(new Date().getDate() - parseInt(da) - 1)
    );

    let sort: any;
    switch (sb) {
      case SORT_BY.DATE_ASC:
        sort = { createdDate: 1 };
        break;
      case SORT_BY.DATE_DES:
      default:
        sort = { createdDate: -1 };
    }

    const findQuery = {
      "subscriptionBrand.type": { $in: subscriptionCategories },
      price: {
        $gte: minPrice,
        $lte: maxPrice
      },
      createdDate: {
        $lte: new Date(currentDate),
        $gte: new Date(oldestDate)
      },
      status: SUBSCRIPTION_STATUS.ACTIVE
    };

    const regex = new RegExp(t, "i");

    if (t.length > 0) {
      Object.assign(findQuery, {
        $or: [
          { $text: { $search: t } },
          { "subscriptionBrand.name": { $regex: regex } }
        ]
      });
    }

    dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .find(findQuery)
      .sort(sort)
      .toArray()
      .then(results => {
        if (results.length === 0) {
          console.log("Unable to find subscriptions");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
          return;
        }
        const data = results
          .map((subscription: any) => {
            if (!subscription.organization) {
              return subscription;
            }

            return {
              _id: subscription._id,
              listingDescription: subscription.listingDescription,
              createdDate: subscription.createdDate,
              firstName: subscription.firstName,
              organization: subscription.organization,
              price: subscription.price,
              status: subscription.status,
              subscriptionBrand: subscription.subscriptionBrand,
              subscriptionBrandname: subscription.subscriptionBrandName,
              subscriptionCategory: subscription.subscriptionCategory,
              subscriptionUrl: subscription.subscriptionUrl,
              otherSubscription: subscription.otherSubscription,
              potentialLimit: subscription.potentialLimit,
            };
          })
          .sort((a: any, b: any) => {
            switch (sb) {
              case SORT_BY.DATE_ASC:
                return a.createdDate - b.createdDate;
              case SORT_BY.DATE_DES:
              default:
                return b.createdDate - a.createdDate;
            }
          });

				if (data.length >= 2) {
					data.splice(2, 0, Sponsors[0]);
				}

        db.close();
        postSuccess(postRes, {
          subscriptions: data
        });
      })
      .catch(findErr => {
        if (findErr) {
          console.log("Error finding record");
          console.log(findErr);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
        }
      });
  });
};
