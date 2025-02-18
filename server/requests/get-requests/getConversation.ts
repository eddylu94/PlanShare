import mongodb from "mongodb";

import {
  authenticate,
  postSuccess,
  postFailure,
  SLACK_HOOK,
  slackPostRequest,
  SlackTitle
} from "../../utils/utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const getConversation = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving conversation...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const currentUserId = findRes._id.toString();

      const { userId } = postReq.query;

      if (currentUserId === userId) {
        db.close();
        postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_CONVERSATION);
        return;
      }

      console.log(userId);

      const dbo = db.db(DATABASE_NAME);
      dbo
        .collection(DATABASE_COLLECTION.USERS_COLLECTION)
        .findOne(
          { _id: new ObjectId(userId) },
          (findProfileErr, findProfileRes) => {
            if (findProfileErr) {
              db.close();
              postFailure(postRes, STATUS_MESSAGE.PROFILE_NOT_FOUND);
              return;
            }
            if (findProfileRes) {
              dbo
                .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
                .findOne(
                  { userIds: { $all: [currentUserId, userId] } },
                  (findConversationErr, findConversationRes) => {
                    if (findConversationErr) {
                      db.close();
                      postFailure(
                        postRes,
                        STATUS_MESSAGE.CANNOT_FIND_CONVERSATION
                      );
                      return;
                    }

                    if (!findConversationRes) {
                      const conversationData = {
                        userIds: [currentUserId, userId],
                        host: currentUserId,
                        messages: [],
                        isPrimaryRead: true,
                        isSecondaryRead: true
                      };

                      dbo
                        .collection(
                          DATABASE_COLLECTION.CONVERSATIONS_COLLECTION
                        )
                        .insertOne(conversationData, (insertErr, insertRes) => {
                          if (insertErr) {
                            const errorMessage = "Error inserting record";
                            console.log(errorMessage);
                            db.close();
                            postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);

                            const supportingText = `
                              \`\`\`
                              Request: getConversation
                              Description: ${errorMessage}
                              Error message: ${insertErr.message}
                              \`\`\`
                            `;

                            slackPostRequest(
                              SLACK_HOOK.ERRORS,
                              SlackTitle.NEW_ERROR,
                              supportingText
                            );

                            return;
                          }

                          console.log("Conversation created");
                          db.close();
                          postSuccess(postRes, {
                            conversation: {
                              conversationId: insertRes.insertedId,
                              username: findProfileRes.username,
                              userId: findProfileRes._id.toString(),
                              messages: []
                            }
                          });
                        });

                      return;
                    } else {
                      const isHost = currentUserId === findConversationRes.host;

                      dbo
                        .collection(
                          DATABASE_COLLECTION.CONVERSATIONS_COLLECTION
                        )
                        .updateOne(
                          { _id: new ObjectId(findConversationRes._id) },
                          {
                            $set: {
                              [isHost
                                ? "isPrimaryRead"
                                : "isSecondaryRead"]: true
                            }
                          }
                        )
                        .then(() => {
                          console.log("Conversation marked as read");
                        })
                        .catch(err => {
                          console.log(
                            "Unable to mark conversation as read",
                            err
                          );
                        });

                      console.log("Conversation retrieved");
                      db.close();
                      postSuccess(postRes, {
                        conversation: {
                          conversationId: findConversationRes._id,
                          username: findProfileRes.username,
                          userId: findProfileRes._id.toString(),
                          messages: findConversationRes.messages
                        }
                      });
                    }
                  }
                );
            }
          }
        );
    })
    .catch(err => {
      console.log(err);

      const supportingText = `
				\`\`\`
				Request: getConversation
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;

      slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
