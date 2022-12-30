import mongodb from "mongodb";

import { authenticate, postSuccess, postFailure } from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SORT_BY,
  SUBSCRIPTION_STATUS
} from "./../../constants";

export const getSubscriptions = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db] = res;

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

      const promises = [];

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

      const subscriptionsPromise = dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .find(findQuery)
        .sort(sort)
        .toArray();

      promises.push(subscriptionsPromise);

      return Promise.all(promises)
        .then(results => {
          // console.log(results)

          if (!results.length) {
            console.log("Unable to find subscriptions");
            db.close();
            postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
            return;
          }

          const data = results
            .reduce((acc, curr) => {
              return acc.concat(curr);
            }, [])
            .sort((a, b) => {
              switch (sb) {
                case SORT_BY.DATE_DES:
                  return b.createdDate - a.createdDate;
                case SORT_BY.DATE_ASC:
                  return a.createdDate - b.createdDate;
                case SORT_BY.SUBSCRIPTION_BRAND_ASC:
                  return b.listingTitle < a.listingTitle ? -1 : 1;
                case SORT_BY.SUBSCRIPTION_BRAND_DES:
                  return b.listingTitle < a.listingTitle ? 1 : -1;
                default:
                  return b.createdDate - a.createdDate;
              }
            });

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
    })
    .catch(err => {
      console.log(err);
    });
};
