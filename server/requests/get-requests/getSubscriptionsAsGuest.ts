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
  SUBSCRIPTION_STATUS,
  LISTING_TYPE
} from "./../../constants";

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

    const {
      isSubscriptionsType,
      isForSaleType,
      t,
      sc,
      gs,
      sb,
      da,
      p
    } = postReq.query;

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

    if (isForSaleType === "true") {
      let sort: any;
      switch (sb) {
        case SORT_BY.DATE_DES:
          sort = { createdDate: -1 };
          break;
        case SORT_BY.DATE_ASC:
          sort = { createdDate: 1 };
          break;
        case SORT_BY.SUBSCRIPTION_BRAND_ASC:
          sort = { listingTitle: 1 };
          break;
        case SORT_BY.SUBSCRIPTION_BRAND_DES:
          sort = { listingTitle: -1 };
          break;
        default:
          sort = { createdDate: -1 };
          break;
      }

      const findQuery = {
        price: {
          $gte: minPrice,
          $lte: maxPrice
        },
        createdDate: {
          $lte: new Date(currentDate),
          $gte: new Date(oldestDate)
        },
        listingType: LISTING_TYPE.FOR_SALE,
        status: SUBSCRIPTION_STATUS.ACTIVE
      };

      if (t.length) {
        Object.assign(findQuery, {
          $text: { $search: t }
        });
      }

      const forSalePromise = dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .find(findQuery)
        .sort(sort)
        .toArray();

      promises.push(forSalePromise);
    }

    if (isSubscriptionsType === "true") {
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
        listingType: LISTING_TYPE.SUBSCRIPTION,
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
    }

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
          .map((subscription: any) => {
            if (!subscription.organization) {
              return subscription;
            }

            switch (subscription.listingType) {
              case LISTING_TYPE.FOR_SALE:
                return {
                  listingType: subscription.listingType,
                  createdDate: subscription.createdDate,
                  firstName: subscription.firstName.substring(0, 1),
                  organization: subscription.organization,
                  price: subscription.price,
                  status: subscription.status,
                  listingTitle: subscription.listingTitle
                };
              case LISTING_TYPE.SUBSCRIPTION:
              default:
                return {
                  listingType: subscription.listingType,
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
            }
          })
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
  });
};
