import mongodb from "mongodb";

import { retrieveOrganizationByDomain } from "./../../organizations";
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

      const { subscriptionData } = obj;

      const domain = getDomain(email);
      const organization = subscriptionData.visibility === 'PUBLIC' ? null : retrieveOrganizationByDomain(domain);

      const newSubscriptionData = {
        userId: findRes._id,
        firstName,
        organization,
        createdDate: new Date(),
        price: parseFloat(subscriptionData.price),
        subscriptionBrandName: subscriptionData.subscriptionBrand.name,
        status: SUBSCRIPTION_STATUS.ACTIVE
      };

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
