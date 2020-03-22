import mongodb from "mongodb";

import { authenticate, getDomain } from "./../utils";
import {
  subscriptionCategories,
  retrieveSubscriptionBrands
} from "./../subscriptions";
import { retrieveOrganizationByDomain } from "./../organizations";
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

export const getOrganizations = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving organizations...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const emails = findRes.emails;

      const organizations = emails
        .map(currentEmail => getDomain(currentEmail))
        .map(currentEmailDomain =>
          retrieveOrganizationByDomain(currentEmailDomain)
        );

      const defaultOrganization = organizations[0];

      console.log("Organization retrieved:", organizations[0]);
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          organizations,
          defaultOrganization
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscriptionCategories = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription categories...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const defaultSubscriptionCategory = subscriptionCategories[0];

      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          subscriptionCategories: subscriptionCategories,
          defaultSubscriptionCategory
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscriptionBrands = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription brand...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const query = postReq.query;

      const subscriptionCategory = query.subscriptionCategory;
      const subscriptionBrands = retrieveSubscriptionBrands(
        subscriptionCategory
      );

      const defaultSubscriptionBrand = subscriptionBrands[0];

      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          subscriptionBrands,
          defaultSubscriptionBrand
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscriptions = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const emails = findRes.emails;

      console.log(emails);

      const dbo = db.db(DATABASE_NAME);

      const promises = emails
        .map(email => getDomain(email))
        .map(domain => retrieveOrganizationByDomain(domain))
        .map((organization: any) => {
          const organizationId = organization.organizationId;
          return dbo
            .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
            .find({ "organization.organizationId": organizationId })
            .toArray()
            .then(findRes => {
              if (!findRes) {
                console.log("Unable to find subscriptions");
                db.close();
                postRes.json({
                  statusCode: STATUS_CODE.FAILURE,
                  statusMessage: STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS
                });
                return;
              }

              return findRes;
            })
            .catch(findErr => {
              if (findErr) {
                console.log("Error finding record");
                db.close();
                postRes.json({
                  statusCode: STATUS_CODE.FAILURE,
                  statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
                });
              }
            });
        });

      Promise.all(promises).then(results => {
        const subscriptions = results.reduce(
          (acc, curr) => acc.concat(curr),
          [] as any
        );
        console.log(subscriptions);

        db.close();
        postRes.json({
          statusCode: STATUS_CODE.SUCCESS,
          body: {
            subscriptions
          }
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getProfile = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving profile...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { firstName, emails, joinedDate } = findRes;

      const organizations = emails.map(currentEmail => {
        const domain = getDomain(currentEmail);
        const organization = retrieveOrganizationByDomain(domain);

        return {
          email: currentEmail,
          organization
        };
      });

      const profileData = {
        firstName,
        organizations,
        joinedDate
      };

      console.log("Profile retrieved:", profileData);
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: { profileData }
      });
    })
    .catch(err => {
      console.log(err);
    });
};
