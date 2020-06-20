import mongodb from "mongodb";

import { postSuccess, postFailure } from "./../../utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  SORT_BY,
  SUBSCRIPTION_STATUS
} from "./../../constants";

export const getSubscriptionsAsGuest = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions as guest...");
  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connerErr, db) => {
    if (connerErr) throw connerErr;

    const { t, sc, gs, sb, da, p } = postReq.query;

    const subscriptionCategories = sc.split(",");

    let [minGroupSize, maxGroupSize] = gs
      ? gs.split(",").map((val: string) => parseInt(val))
      : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

    let [minPrice, maxPrice] = p
      ? p.split(",").map((val: string) => parseInt(val))
      : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

    let sort: any;
    switch (sb) {
      case SORT_BY.DATE_DES:
        sort = { createdDate: -1 };
        break;
      case SORT_BY.DATE_ASC:
        sort = { createdDate: 1 };
        break;
      case SORT_BY.SUBSCRIPTION_BRAND_ASC:
        sort = { "subscriptionBrand.name": 1 };
        break;
      case SORT_BY.SUBSCRIPTION_BRAND_DES:
        sort = { "subscriptionBrand.name": -1 };
        break;
      default:
        sort = { createdDate: -1 };
        break;
    }

    const dbo = db.db(DATABASE_NAME);

    const currentDate = new Date();
    const oldestDate = new Date(
      new Date().setDate(new Date().getDate() - parseInt(da) - 1)
    );

    const findQuery = {
      "subscriptionBrand.type": { $in: subscriptionCategories },
      numberOfPeople: {
        $gte: minGroupSize,
        $lte: maxGroupSize
      },
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

    if (t.length) {
      Object.assign(findQuery, {
        $text: { $search: t }
      });
    }

    return dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .find(findQuery)
      .sort(sort)
      .toArray()
      .then(findRes => {
        if (!findRes) {
          console.log("Unable to find subscriptions");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
          return;
        }

        findRes = findRes.map((subscription: any) => {
          return {
            createdDate: subscription.createdDate,
            firstName: subscription.firstName.substring(0, 1),
            numberOfPeople: subscription.numberOfPeople,
            organization: subscription.organization,
            price: subscription.price,
            status: subscription.status,
            subscriptionBrand: subscription.subscriptionBrand,
            subscriptionBrandname: subscription.subscriptionBrandName,
            subscriptionCategory: subscription.subscriptionCategory,
            subscriptionUrl: subscription.subscriptionUrl,
            otherSubscription: subscription.otherSubscription
          };
        });

        db.close();
        postSuccess(postRes, {
          subscriptions: findRes
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
