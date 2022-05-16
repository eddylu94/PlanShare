import mongodb from "mongodb";

import { authenticate, postSuccess } from "./../../utils";
import { DATABASE_NAME, DATABASE_COLLECTION } from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const editSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Editing subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { username } = findRes;

      const { subscriptionData } = obj;

      const { subscriptionId } = subscriptionData;

      Object.assign(subscriptionData, {
        username,
        editedDate: new Date(),
        numberOfPeople: parseInt(subscriptionData.numberOfPeople),
        price: parseFloat(subscriptionData.price),
        subscriptionUrl: subscriptionData.subscriptionUrl,
        subscriptionBrandName:
          subscriptionData.subscriptionBrand &&
          subscriptionData.subscriptionBrand.name
      });

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .updateOne(
          { _id: new ObjectId(subscriptionId) },
          { $set: { ...subscriptionData } }
        )
        .then(() => {
          console.log("Subscription updated:", subscriptionId);

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
