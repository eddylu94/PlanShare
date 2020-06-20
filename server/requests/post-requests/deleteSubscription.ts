import mongodb from "mongodb";

import { authenticate, postSuccess } from "./../../utils";
import { DATABASE_NAME, DATABASE_COLLECTION } from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const deleteSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Deleting subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { subscriptionId } = obj;

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .deleteOne({ _id: new ObjectId(subscriptionId) })
        .then(() => {
          console.log("Subscription deleted:", subscriptionId);

          db.close();
          postSuccess(postRes, {});
        });
    })
    .catch(err => {
      console.log(err);
    });
};
