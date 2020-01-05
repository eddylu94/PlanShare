const {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES
} = require("./../constants.js");

const getValidationEmail = (mongoClient, postReq, postRes) => {
  console.log("Retrieving validation email...");
  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connerErr, db) => {
    if (connerErr) throw connerErr;

    const headerAuthorization = postReq.headers.authorization;
    const authKey = headerAuthorization.replace("Bearer ", "");
    console.log(authKey);

    const dbo = db.db(DATABASE_NAME);
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ "authTokens.key": authKey }, (findErr, findRes) => {
        console.log(findRes);

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
      });
  });
};

module.exports = {
  getValidationEmail
};
