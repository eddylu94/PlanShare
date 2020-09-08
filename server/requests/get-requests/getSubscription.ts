import mongodb from "mongodb";

import {
  authenticate,
  getDomain,
  postSuccess,
  postFailure
} from "./../../utils";
import { retrieveOrganizationByDomain } from "./../../organizations";
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

    const email = findRes.email;
    const domain = getDomain(email);

    const { subscriptionId } = postReq.query;

    console.log(postReq.query);

    console.log(subscriptionId);

    const dbo = db.db(DATABASE_NAME);

    return dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .findOne(
        { _id: new ObjectId(subscriptionId) },
        (findErr, subscriptionFindRes) => {
          const organization = retrieveOrganizationByDomain(domain);
          const organizationId = organization && organization.organizationId;

          if (!organizationId === subscriptionFindRes.organizationId) {
            console.log(
              "User does not belong in organization of selected subscription"
            );
            db.close();
            postFailure(
              postRes,
              STATUS_MESSAGE.USER_NOT_MEMBER_OF_ORGANIZATION
            );
            return;
          }

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
