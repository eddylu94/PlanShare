import mongodb from "mongodb";

import {
  authenticate,
  postSuccess,
  postFailure,
  slackPostRequest,
  SLACK_HOOK,
  SlackTitle
} from "../../utils/utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const getProfile = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving profile...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { firstName, joinedDate } = findRes;

      const { profileUserId } = postReq.query;

      if (!profileUserId) {
        const profileData = {
          firstName,
          joinedDate
        };

        console.log("Profile retrieved:", profileData);
        db.close();
        postSuccess(postRes, { profileData });
      } else {
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
                const { firstName, joinedDate } = findProfileRes;

                const profileData = {
                  firstName,
                  joinedDate
                };

                console.log("Profile retrieved:", profileData);
                db.close();
                postSuccess(postRes, { profileData });
              }
            }
          );
      }
    })
    .catch(err => {
      console.log(err);

      const supportingText = `
				\`\`\`
				Request: getProfile
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;

      slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
