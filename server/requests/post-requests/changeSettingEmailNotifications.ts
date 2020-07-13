import mongodb from "mongodb";

import { authenticate, postSuccess, postFailure } from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE
} from "./../../constants";

export const changeSettingEmailNotifications = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Changing email notifications setting...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const dbo = db.db(DATABASE_NAME);

      const { settingEmailNotifications } = obj;

      dbo
        .collection(DATABASE_COLLECTION.USERS_COLLECTION)
        .updateOne(
          { _id: findRes._id },
          { $set: { settingEmailNotifications } }
        )
        .then(() => {
          console.log("Email notifications setting successfully updated");
          db.close();
          postSuccess(postRes, {});
        })
        .catch(err => {
          console.log(err);

          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
