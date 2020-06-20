import mongodb from "mongodb";

import { authenticate, postSuccess } from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  SUBSCRIPTION_STATUS
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const archiveSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Archiving subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { subscriptionId } = obj;

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .updateOne(
          { _id: new ObjectId(subscriptionId) },
          { $set: { status: SUBSCRIPTION_STATUS.DELISTED } }
        )
        .then(() => {
          console.log("Subscription archived:", subscriptionId);

          db.close();
          postSuccess(postRes, {});
        });
    })
    .catch(err => {
      console.log(err);
    });
};
