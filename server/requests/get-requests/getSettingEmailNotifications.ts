import mongodb from "mongodb";

import { authenticate, postSuccess } from "./../../utils";

export const getSettingEmailNotifications = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving email notifications setting...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { settingEmailNotifications } = findRes;

      db.close();
      postSuccess(postRes, {
        settingEmailNotifications
      });
    })
    .catch(err => {
      console.log(err);
    });
};
