import mongodb from "mongodb";

import {
  authenticate,
  getOtherUser,
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

export const getConversationById = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving conversation by ID...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const userId = findRes._id.toString();

      const { conversationId } = postReq.query;

      console.log("Conversation ID:", conversationId);

      const dbo = db.db(DATABASE_NAME);
      dbo
        .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
        .findOne(
          { _id: new ObjectId(conversationId) },
          (findConversationErr, findConversationRes) => {
            if (findConversationErr) {
              db.close();
              postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_CONVERSATION);

              return;
            }

            if (findConversationRes) {
              const { userIds } = findConversationRes;

              if (!userIds.includes(userId)) {
                db.close();
                postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_CONVERSATION);

                return;
              }

              const otherUserId = getOtherUser(userIds, userId);

              dbo
                .collection(DATABASE_COLLECTION.USERS_COLLECTION)
                .findOne(
                  { _id: new ObjectId(otherUserId) },
                  (findOtherUserErr, findOtherUserRes) => {
                    if (findOtherUserErr || !findOtherUserRes) {
                      db.close();
                      postFailure(
                        postRes,
                        STATUS_MESSAGE.CANNOT_FIND_CONVERSATION
                      );

                      return;
                    }

                    const isHost = userId === findConversationRes.host;

                    dbo
                      .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
                      .updateOne(
                        { _id: new ObjectId(findConversationRes._id) },
                        {
                          $set: {
                            [isHost ? "isPrimaryRead" : "isSecondaryRead"]: true
                          }
                        }
                      )
                      .then(() => {
                        console.log("Conversation marked as read");
                      })
                      .catch(err => {
                        console.log("Unable to mark conversation as read", err);
                      })
                      .finally(() => {
                        db.close();
                        postSuccess(postRes, {
                          conversation: {
                            conversationId: findConversationRes._id,
                            username: findOtherUserRes.username.toString(),
                            userId: findOtherUserRes._id.toString(),
                            messages: findConversationRes.messages
                          }
                        });
                      });
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
				Request: getConversationById
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;

      slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
