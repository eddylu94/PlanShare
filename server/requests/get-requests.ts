import mongodb from "mongodb";

import { authenticate, getDomain, obtainUniversityName } from "./../utils";
import {
  SUBSCRIPTION_TYPE,
  retrieveSubscriptionGroup
} from "./../subscriptions";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES
} from "./../constants";

export const getValidationEmail = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving validation email...");

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connerErr, db) => {
    if (connerErr) throw connerErr;

    const headerAuthorization = postReq.headers.authorization;
    const authKey = headerAuthorization.replace("Bearer ", "");

    const dbo = db.db(DATABASE_NAME);
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ "authTokens.key": authKey }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
          throw findErr;
        }

        if (!findRes) {
          console.log("Unable to find account for validation");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          });
          return;
        }

        const email: string = findRes.email;

        if (findRes.emails.indexOf(email) >= 0) {
          console.log("Email already validated");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            statusMessage: STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED
          });
          return;
        }

        console.log("Email retrieved:", email);
        db.close();
        postRes.json({
          statusCode: STATUS_CODE.SUCCESS,
          body: {
            email
          }
        });
      });
  });
};

export const getGroups = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving groups...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const emails = findRes.emails;

      const groups = emails
        .map(currentEmail => getDomain(currentEmail))
        .map((currentEmailDomain, i) => {
          return {
            email: emails[i],
            name: obtainUniversityName(currentEmailDomain)
          };
        });

      const defaultGroup = groups[0];

      console.log("Groups retrieved:", groups);
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          groups,
          defaultGroup
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscriptionTypes = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription types...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const subscriptionTypes = SUBSCRIPTION_TYPE;

      const defaultSubscriptionType =
        subscriptionTypes[Object.keys(subscriptionTypes)[0]];

      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          subscriptionTypes,
          defaultSubscriptionType
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscriptionGroup = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription group...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const query = postReq.query;

      const subscriptionType = query.subscriptionType;
      const subscriptionGroup = retrieveSubscriptionGroup(subscriptionType);

      const defaultSubscriptionGroup =
        subscriptionGroup[Object.keys(subscriptionGroup)[0]];

      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          subscriptionGroup,
          defaultSubscriptionGroup
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};
