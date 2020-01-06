const {
  authenticate,
  getDomain,
  obtainUniversityName
} = require("./../utils.js");
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

      const { email, emails } = findRes;

      if (findRes.emails.indexOf(email) < 0) {
        console.log("User is not validated");
        db.close();
        postRes.json({
          statusCode: STATUS_CODE.FAILURE,
          statusMessage: STATUS_MESSAGE.USER_NOT_VALIDATED
        });
        return;
      }

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

module.exports = {
  getValidationEmail,
  getGroups
};
