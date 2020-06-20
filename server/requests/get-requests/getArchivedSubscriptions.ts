import mongodb from "mongodb";

import { authenticate, postSuccess, postFailure } from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SUBSCRIPTION_STATUS
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const getArchivedSubscriptions = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions by author...");
  authenticate(mongoClient, postReq, postRes).then(res => {
    const [db, findRes] = res;

    const userId = findRes._id;

    const dbo = db.db(DATABASE_NAME);

    dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .find({
        userId: new ObjectId(userId),
        status: SUBSCRIPTION_STATUS.DELISTED
      })
      .toArray()
      .then(findSubscriptionsRes => {
        if (!findSubscriptionsRes) {
          console.log("Unable to find subscriptions");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
          return;
        }

        console.log("Archived subscriptions retrieved");

        db.close();
        postSuccess(postRes, {
          subscriptions: findSubscriptionsRes
        });
      })
      .catch(findErr => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
        }
      });
  });
};
