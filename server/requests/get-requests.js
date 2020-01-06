const {
  authenticate,
  getDomain,
  obtainUniversityName
} = require("./../utils.js");
const {
  SUBSCRIPTION_TYPE,
  retrieveSubscriptionGroup
} = require("./../subscriptions.js");
const { STATUS_CODE, STATUS_MESSAGE } = require("./../constants.js");

const getValidationEmail = (mongoClient, postReq, postRes) => {
  console.log("Retrieving validation email...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { email } = findRes;

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
    })
    .catch(err => {
      console.log(err);
    });
};

const getGroups = (mongoClient, postReq, postRes) => {
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

      console.log("Groups retrieved:", groups);
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          groups
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

const getSubscriptionTypes = (mongoClient, postReq, postRes) => {
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

const getSubscriptionGroup = (mongoClient, postReq, postRes) => {
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

module.exports = {
  getValidationEmail,
  getGroups,
  getSubscriptionTypes,
  getSubscriptionGroup
};
