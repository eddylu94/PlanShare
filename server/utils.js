const {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES
} = require("./constants.js");

const authenticate = (mongoClient, postReq, postRes) => {
  return new Promise((resolve, reject) => {
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

          resolve([db, findRes]);
        });
    });
  });
};

const generateConfirmationCode = () => {
  const CONFIRMATION_CODE_LENGTH = 5;

  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < CONFIRMATION_CODE_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const btoa = str => {
  return Buffer.from(str).toString("base64");
};

const generateHexString = () => {
  const HEX_STRING_LENGTH = 26;

  let ret = "";
  while (ret.length < HEX_STRING_LENGTH) {
    ret += Math.random()
      .toString(16)
      .substring(2);
  }
  return ret.substring(0, HEX_STRING_LENGTH);
};

const generateAuthKey = () => {
  return btoa(generateHexString());
};

const generateAuthToken = () => {
  return {
    date: new Date().getTime(),
    key: generateAuthKey()
  };
};

const getDomain = emailAddress => {
  const atSign = emailAddress.indexOf("@");
  return emailAddress.substring(atSign + 1);
};

const obtainUniversityName = emailDomain => {
  const universities = require("./world_universities_and_domains.json");

  const university = universities.find(university => {
    const domains = university.domains;
    for (let i = 0; i < domains.length; i++) {
      const domainLength = domains[i].length;
      const emailLength = emailDomain.length;

      if (
        emailLength >= domainLength &&
        emailDomain.substring(emailLength - domainLength) === domains[i]
      ) {
        return true;
      }
    }
    return false;
  });

  const name = university && university.name;
  return name ? name : "";
};

module.exports = {
  authenticate,
  generateConfirmationCode,
  generateAuthToken,
  getDomain,
  obtainUniversityName
};
