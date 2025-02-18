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

interface IConversationPreview {
  conversationId: string;
  username: string;
  userId: string;
  lastMessage: any;
  isRead: boolean;
}

export const getConversationsList = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving conversations list...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const userId = findRes._id.toString();
      const currentUsername = findRes.username;

      const dbo = db.db(DATABASE_NAME);
      dbo
        .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
        .find({ userIds: userId })
        .toArray()
        .then(findRes => {
          if (!findRes) {
            console.log("Unable to find conversations list");
            db.close();
            postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_CONVERSATIONS_LIST);
            return;
          }

          if (findRes.length === 0) {
            console.log("Conversations list empty");
            db.close();
            postSuccess(postRes, {
              conversationsList: []
            });
            return;
          }

          // console.log("Conversations length:", findRes.length);

          const conversationsListPromises = findRes.map(conversation => {
            const otherUserId = getOtherUser(conversation.userIds, userId);

            return new Promise((resolve, reject) => {
              dbo
                .collection(DATABASE_COLLECTION.USERS_COLLECTION)
                .findOne(
                  { _id: new ObjectId(otherUserId) },
                  (findUserErr, findUserRes) => {
                    if (findUserErr) {
                      db.close();
                      postFailure(
                        postRes,
                        STATUS_MESSAGE.CANNOT_FIND_CONVERSATIONS_LIST
                      );
                      return;
                    }

                    const username = findUserRes.username;
                    const otherUserId = findUserRes._id.toString();

                    const messages = conversation.messages;

                    if (messages.length === 0) {
                      resolve(null);
                    }

                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage) {
                      Object.assign(lastMessage, {
                        username:
                          lastMessage.userId === userId
                            ? currentUsername
                            : findUserRes.username
                      });
                    }

                    const conversationId = conversation._id.toString();

                    const isHost = userId === conversation.host;
                    const isRead =
                      (isHost && conversation.isPrimaryRead) ||
                      (!isHost && conversation.isSecondaryRead);

                    resolve({
                      conversationId,
                      username,
                      userId: otherUserId,
                      lastMessage,
                      isRead
                    });
                  }
                );
            });
          });

          Promise.all(conversationsListPromises).then(conversationsList => {
            const filteredConversationsList = conversationsList.filter(
              conversation => conversation != null
            ) as Array<IConversationPreview>;

            const unreadMessages = filteredConversationsList.filter(
              conversation => !conversation.isRead
            ).length;

            console.log("Conversations list retrieved");
            db.close();
            postSuccess(postRes, {
              conversationsList: filteredConversationsList,
              unreadMessages
            });
          });

          return findRes;
        })
        .catch(findErr => {
          if (findErr) {
            console.log("Error finding record");
            db.close();
            postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
          }
        });
    })
    .catch(err => {
      console.log(err);

      const supportingText = `
				\`\`\`
				Request: getConversationsList
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;

      slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
