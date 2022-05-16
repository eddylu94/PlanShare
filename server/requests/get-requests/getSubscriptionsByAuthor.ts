import mongodb from "mongodb";

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

const ObjectId = mongodb.ObjectID;

export const getSubscriptionsByAuthor = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions by author...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const findResEmail = findRes.email;
      const userId = findRes._id;

      const { profileUserId } = postReq.query;

      if (profileUserId) {
        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .findOne(
            { _id: new ObjectId(profileUserId) },
            (findProfileErr, findProfileRes) => {
              if (findProfileErr) {
                postFailure(postRes, STATUS_MESSAGE.PROFILE_NOT_FOUND);
              }
              if (findProfileRes) {
                const findProfileResEmail = findProfileRes.email;

                const currentUserDomain = getDomain(findRes.email);

                const email =
                  currentUserDomain === getDomain(findProfileResEmail)
                    ? findProfileResEmail
                    : undefined;

                if (!email) {
                  console.log("Unable to find subscriptions");
                  db.close();
                  postFailure(
                    postRes,
                    STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS
                  );
                  return;
                }

                dbo
                  .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
                  .find({
                    userId: new ObjectId(profileUserId),
                    status: SUBSCRIPTION_STATUS.ACTIVE
                  })
                  .toArray()
                  .then(findRes => {
                    if (!findRes) {
                      console.log("Unable to find subscriptions");
                      db.close();
                      postFailure(
                        postRes,
                        STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS
                      );
                      return;
                    }

                    db.close();
                    postSuccess(postRes, {
                      subscriptions: findRes
                    });
                  })
                  .catch(findErr => {
                    if (findErr) {
                      console.log("Error finding record");
                      db.close();
                      postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
                    }
                  });
              }
            }
          );
      } else {
        const dbo = db.db(DATABASE_NAME);

        dbo
          .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
          .find({
            userId: new ObjectId(userId),
            status: SUBSCRIPTION_STATUS.ACTIVE
          })
          .toArray()
          .then(findRes => {
            if (!findRes) {
              console.log("Unable to find subscriptions");
              db.close();
              postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
              return;
            }

            db.close();
            postSuccess(postRes, {
              subscriptions: findRes
            });
          })
          .catch(findErr => {
            if (findErr) {
              console.log("Error finding record");
              db.close();
              postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
            }
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
