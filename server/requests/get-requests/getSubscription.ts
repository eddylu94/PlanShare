import mongodb from "mongodb";

import { authenticate, postSuccess, postFailure } from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SUBSCRIPTION_STATUS
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const getSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription...");
  authenticate(mongoClient, postReq, postRes).then(res => {
    const [db, findRes] = res;

    const { subscriptionId } = postReq.query;

    console.log(postReq.query);

    console.log(subscriptionId);

    const dbo = db.db(DATABASE_NAME);

    return dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .findOne(
        { _id: new ObjectId(subscriptionId) },
        (findErr, subscriptionFindRes) => {
          if (
            !(
              findRes._id.toString() ===
                subscriptionFindRes.userId.toString() ||
              subscriptionFindRes.status === SUBSCRIPTION_STATUS.ACTIVE
            )
          ) {
            console.log("User does not have access to subscription");
            db.close();
            postFailure(
              postRes,
              STATUS_MESSAGE.USER_REQUIRES_ACCESS_FOR_SUBSCRIPTION
            );
            return;
          }

          db.close();
          postSuccess(postRes, {
            subscriptionData: subscriptionFindRes
          });
        }
      );
  });
};
