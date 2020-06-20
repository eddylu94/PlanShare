import mongodb from "mongodb";

import { authenticate, postSuccess } from "./../../utils";

export const getEmailAddress = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving email address...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { email } = findRes;

      db.close();
      postSuccess(postRes, {
        email
      });
    })
    .catch(err => {
      console.log(err);
    });
};
