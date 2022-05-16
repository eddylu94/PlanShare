import mongodb from "mongodb";

import {
  authenticate,
  getDomain,
  postSuccess,
  postFailure,
  ERROR_TYPE,
  SLACK_HOOK,
  slackPostRequest
} from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SUBSCRIPTION_STATUS,
  LISTING_TYPE
} from "./../../constants";

export const createSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Creating subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { username } = findRes;

      const { subscriptionData } = obj;

      let newSubscriptionData;

      switch (subscriptionData.listingType) {
        case LISTING_TYPE.FOR_SALE:
          newSubscriptionData = {
            userId: findRes._id,
            username,
            createdDate: new Date(),
            price: parseFloat(subscriptionData.price),
            status: SUBSCRIPTION_STATUS.ACTIVE
          };
          break;
        case LISTING_TYPE.HOUSING:
          newSubscriptionData = {
            userId: findRes._id,
            username,
            createdDate: new Date(),
            price: parseFloat(subscriptionData.price),
            numBedrooms: parseInt(subscriptionData.numBedrooms),
            numBathrooms: parseInt(subscriptionData.numBathrooms),
            status: SUBSCRIPTION_STATUS.ACTIVE
          };
          break;
        case LISTING_TYPE.SUBSCRIPTION:
        default:
          newSubscriptionData = {
            userId: findRes._id,
            username,
            createdDate: new Date(),
            numberOfPeople: parseInt(subscriptionData.numberOfPeople),
            price: parseFloat(subscriptionData.price),
            subscriptionBrandName: subscriptionData.subscriptionBrand.name,
            status: SUBSCRIPTION_STATUS.ACTIVE
          };
          break;
      }

      Object.assign(subscriptionData, newSubscriptionData);

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .insertOne(subscriptionData, (insertErr, insertRes) => {
          if (insertErr) {
            const errorMessage = "Error inserting record";
            console.log(errorMessage);
            db.close();
            postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

            const postRequestData = {
              text: JSON.stringify({
                request: "createSubscription",
                errorType: ERROR_TYPE.SERVER,
                errorMessage,
                error: insertErr
              })
            };
            slackPostRequest(SLACK_HOOK.ERRORS, postRequestData);

            return;
          }

          const subscriptionId = insertRes.insertedId;

          console.log("Subscription created:", subscriptionId);

          db.close();
          postSuccess(postRes, {
            subscriptionId
          });
        });
    })
    .catch(err => {
      console.log(err);
    });
};
