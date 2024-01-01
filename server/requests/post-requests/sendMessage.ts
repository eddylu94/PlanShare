import mongodb from "mongodb";

import socketIo from "socket.io";

import { authenticate, postSuccess, postFailure, SLACK_HOOK, SlackTitle, slackPostRequest } from "../../utils/utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

export const sendMessage = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any,
  io: socketIo.Server
) => {
  console.log("Submitting message...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const userId = findRes._id.toString();

      const { conversationId, message } = postReq.body;

      console.log(conversationId);
      console.log(message);

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

              const messageData = {
							userId,
                date: new Date(),
                message
              };

							const isHost = userId === findConversationRes.host;

              dbo
                .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
                .updateOne(
                  { _id: new ObjectId(conversationId) },
                  {
										$set: { [isHost ? "isSecondaryRead" : "isPrimaryRead"]: false },
										$push: { messages: messageData }
									},
                )
                .then(() => {
                  io.emit("message sent", "Hello World !");

									const supportingText = `
										\`\`\`
										User ID: ${findRes._id}
										\`\`\`
									`;
									
									slackPostRequest(SLACK_HOOK.MESSAGES, SlackTitle.MESSAGE_SENT, supportingText);

                  db.close();
                  postSuccess(postRes, {});
                });
            }
          }
        );
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: sendMessage
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
