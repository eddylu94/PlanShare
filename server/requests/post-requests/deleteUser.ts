import mongodb from "mongodb";

import {
  comparePassword,
  postSuccess,
  postFailure,
  SLACK_HOOK,
  slackPostRequest,
	SlackTitle
} from "./../../utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const deleteUser = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Deleting user...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);
      db.close();
      postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

			const supportingText = `
				Request: deleteUser
				Description: ${errorMessage}
				Error message: ${connectErr.message}
			`;

			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);

      return;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user exists
    const email = obj.email.toLocaleLowerCase();
    const { pass } = obj;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ email }, (findErr, findRes) => {
        if (findErr) {
          const errorMessage = "Error finding record";
          console.log(errorMessage);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

					const supportingText = `
						Request: deleteUser
						Description: ${errorMessage}
						Error message: ${findErr.message}
					`;
		
					slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);

          return;
        }

        if (!findRes) {
          console.log("Email address does not exist:", email);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.INCORRECT_CRED);
          return;
        }

        const removeUser = (err: any, isPasswordMatch: any) => {
          if (err) {
            console.log(err);
            return;
          }

          if (isPasswordMatch === false) {
            console.log("Incorrect password:", email);
            db.close();
            postFailure(postRes, STATUS_MESSAGE.INCORRECT_CRED);
            return;
          } else if (isPasswordMatch === true) {
            const currentUserId = findRes._id.toString();

            const removeUserPromise = new Promise((resolve, reject) => {
              dbo
                .collection(DATABASE_COLLECTION.USERS_COLLECTION)
                .deleteOne({ _id: new ObjectId(currentUserId) })
                .then(() => {
                  console.log("User entry has been removed:");
                  resolve();
                });
            });

            const removeSubscriptionsPromise = new Promise(
              (resolve, reject) => {
                dbo
                  .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
                  .deleteMany({ userId: new ObjectId(currentUserId) })
                  .then(() => {
                    console.log("Subscription entries have been removed");
                    resolve();
                  });
              }
            );

            const removeConversationsPromise = new Promise(
              (resolve, reject) => {
                console.log({ userIds: currentUserId });
                dbo
                  .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
                  .deleteMany({
                    userIds: { $elemMatch: { $eq: currentUserId } }
                  })
                  .then(res => {
                    console.log("Conversation entries have been removed");
                    resolve();
                  });
              }
            );

            Promise.all([
              removeUserPromise,
              removeSubscriptionsPromise,
              removeConversationsPromise
            ])
              .then(() => {
                console.log("User has been removed", email);
                db.close();
                postSuccess(postRes, {});
              })
              .catch(err => {
                console.log(err);
              });
          }
        };

        comparePassword(pass, findRes.pass, removeUser);
      });
  });
};
