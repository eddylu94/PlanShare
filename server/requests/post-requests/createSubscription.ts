import mongodb from "mongodb";

import { retrieveOrganizationByDomain } from "./../../organizations";
import {
  authenticate,
  getDomain,
  postSuccess,
  postFailure
} from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SUBSCRIPTION_STATUS
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

      const { firstName, email } = findRes;

      const domain = getDomain(email);
      const organization = retrieveOrganizationByDomain(domain);

      const { subscriptionData } = obj;

      Object.assign(subscriptionData, {
        userId: findRes._id,
        firstName,
        organization,
        createdDate: new Date(),
        numberOfPeople: parseInt(subscriptionData.numberOfPeople),
        price: parseFloat(subscriptionData.price),
        subscriptionBrandName: subscriptionData.subscriptionBrand.name,
        status: SUBSCRIPTION_STATUS.ACTIVE
      });

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .insertOne(subscriptionData, (insertErr, insertRes) => {
          if (insertErr) {
            console.log("Error inserting record");
            db.close();
            postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
            throw insertErr;
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
