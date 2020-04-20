import mongodb from "mongodb";
import bcrypt from "bcryptjs";

import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES
} from "./constants";

interface IAuthToken {
  date: number;
  key: string;
}

export interface IPendingEmail {
  email: string;
  confirmationCode: string;
}

interface IFindResult {
  _id: mongodb.ObjectID;
  firstName: string;
  email: string;
  pass: string;
  joinedDate: number;
  authTokens: IAuthToken[];
  emails: string[];
  pendingEmails: IPendingEmail[];
}

interface IUniversity {
  web_pages: string[];
  name: string;
  alpha_two_code: string;
  "state-province": string;
  domains: string[];
  country: string;
}

const SALT_ROUNDS = 10;

export const encryptPassword = function(password: any, callback: any) {
  bcrypt.genSalt(SALT_ROUNDS, function(err: any, salt: any) {
    if (err) return callback(err);

    bcrypt.hash(password, salt, function(err: any, hash: any) {
      return callback(err, hash);
    });
  });
};

export const comparePassword = function(
  plainPass: string,
  hashword: string,
  callback: any
) {
  bcrypt.compare(plainPass, hashword, function(err: any, isPasswordMatch: any) {
    return err == null ? callback(null, isPasswordMatch) : callback(err);
  });
};

export const authenticate = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
): Promise<[mongodb.MongoClient, IFindResult]> => {
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

          if (findRes.emails.indexOf(findRes.email) < 0) {
            console.log("User is not validated");
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.FAILURE,
              statusMessage: STATUS_MESSAGE.USER_NOT_VALIDATED
            });
            return;
          }

          resolve([db, findRes]);
        });
    });
  });
};

export const generateConfirmationCode = () => {
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

const btoa = (str: string) => {
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

export const generateAuthToken = () => {
  return {
    date: new Date().getTime(),
    key: generateAuthKey()
  };
};

export const getDomain = (emailAddress: string) => {
  const atSign = emailAddress.indexOf("@");
  return emailAddress.substring(atSign + 1);
};
