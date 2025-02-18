import mongodb from "mongodb";
import bcrypt from "bcryptjs";
import request from "request";

import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  ACCOUNT_STATUS
} from "../constants";
import { logToGoogleSheet } from "./appendGoogleSheet";

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
  email: string;
  pass: string;
  joinedDate: number;
  authTokens: IAuthToken[];
  pendingEmails: IPendingEmail[];
  status: string;
  authAttempts: Date[];
  settingEmailNotifications: string;
  username: string;
}

export const SLACK_HOOK = {
  SIGNUPS:
    "https://hooks.slack.com/services/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",
  ERRORS:
    "https://hooks.slack.com/services/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",
  POSTS:
    "https://hooks.slack.com/services/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",
  MESSAGES:
    "https://hooks.slack.com/services/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",
  FEEDBACK:
    "https://hooks.slack.com/services/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"
};

const findSlackHookKeyByValue = (value: string) => {
  const entries = Object.entries(SLACK_HOOK);

  for (const entry of entries) {
    if (entry[1] === value) {
      return entry[0];
    }
  }

  return "";
};

export const SlackTitle = {
  NEW_ERROR: ":warning: New error",
  NEW_USER_REGISTERED: ":new: New user registered",
  FEEDBACK: ":mailbox_with_mail: Feedback",
  EMAIL_ADDED: ":inbox_tray: Email added",
  USER_VALIDATED: ":white_check_mark: User validated",
  MESSAGE_SENT: ":email: Message sent",
  LISTING_POSTED: ":tada: Listing posted",
  LISTING_EDITED: ":pencil2: Listing edited"
};

const removeLeadingSpaces = (text: string) => text.replace(/^\s+/gm, "");

export const slackPostRequest = (
  slackHook: string,
  title: string,
  supporting: string | null
) => {
  let text = title + `\n`;
  if (supporting != null) {
    text += removeLeadingSpaces(supporting) + "\n";
  }

  request.post(
    {
      url: slackHook,
      body: JSON.stringify({ text })
    },
    function(err: any, data: any) {
      console.log(data.body);
    }
  );

  logToGoogleSheet(
    findSlackHookKeyByValue(slackHook),
    title,
    supporting != null ? removeLeadingSpaces(supporting) : ""
  );
};

const SALT_ROUNDS = 10;

export const encryptPassword = (password: any, callback: any) => {
  bcrypt.genSalt(SALT_ROUNDS, (err: any, salt: any) => {
    if (err) return callback(err);

    bcrypt.hash(password, salt, (err: any, hash: any) => {
      return callback(err, hash);
    });
  });
};

export const comparePassword = (
  plainPass: string,
  hashword: string,
  callback: any
) => {
  bcrypt.compare(plainPass, hashword, (err: any, isPasswordMatch: any) => {
    return err == null ? callback(null, isPasswordMatch) : callback(err);
  });
};

export const authenticate = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
): Promise<[mongodb.MongoClient, IFindResult]> => {
  return new Promise((resolve, reject) => {
    mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
      if (connectErr) {
        const errorMessage = "Connection error";
        console.log(errorMessage);

        const supportingText = `
					\`\`\`
					Request: authenticate
					Description: ${errorMessage}
					Error message: ${connectErr.message}
					\`\`\`
				`;

        slackPostRequest(
          SLACK_HOOK.ERRORS,
          SlackTitle.NEW_ERROR,
          supportingText
        );

        return;
      }

      const headerAuthorization = postReq.headers.authorization;
      const authKey = headerAuthorization.replace("Bearer ", "");

      const dbo = db.db(DATABASE_NAME);
      dbo
        .collection(DATABASE_COLLECTION.USERS_COLLECTION)
        .findOne({ "authTokens.key": authKey }, (findErr, findRes) => {
          if (findErr) {
            const errorMessage = "Error finding record";
            console.log(errorMessage);
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.FAILURE,
              statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
            });

            const supportingText = `
							\`\`\`
							Request: authenticate
							Description: ${errorMessage}
							Error message: ${findErr.message}
							\`\`\`
						`;

            slackPostRequest(
              SLACK_HOOK.ERRORS,
              SlackTitle.NEW_ERROR,
              supportingText
            );

            return;
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

          if (findRes.status !== ACCOUNT_STATUS.LIVE) {
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
  // const characters =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const characters = "0123456789";
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

export const getOtherUser = (users: string[], currentUser: string) => {
  return users.find(user => user !== currentUser);
};

export const postSuccess = (postRes: any, body: any) => {
  postRes.json({
    statusCode: STATUS_CODE.SUCCESS,
    body
  });
};

export const postFailure = (
  postRes: any,
  statusMessage: string,
  additionalParams?: any
) => {
  postRes.json({
    statusCode: STATUS_CODE.FAILURE,
    statusMessage,
    ...(additionalParams != null && additionalParams)
  });
};
