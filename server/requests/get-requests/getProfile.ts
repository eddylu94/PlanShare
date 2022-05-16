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

      const { username, email, joinedDate } = findRes;

      const { profileUserId } = postReq.query;

      if (!profileUserId) {
        const domain = getDomain(email);
        const organization = retrieveOrganizationByDomain(domain);

        const profileData = {
          username,
          organization,
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
                const { username, joinedDate } = findProfileRes;

                const otherUserEmail = findProfileRes.email;

                const currentUserDomain = getDomain(findRes.email);

                const otherUserDomain = getDomain(otherUserEmail);

                let otherUserOrganization;
                if (currentUserDomain === otherUserDomain) {
                  otherUserOrganization = retrieveOrganizationByDomain(
                    otherUserDomain
                  );
                }

                const profileData = {
                  username,
                  organization: otherUserOrganization,
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
    });
};
