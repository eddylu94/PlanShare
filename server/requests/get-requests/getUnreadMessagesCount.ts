import mongodb from "mongodb";

import {
  authenticate,
  postSuccess,
  postFailure,
	slackPostRequest,
	SLACK_HOOK,
	SlackTitle
} from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE
} from "./../../constants";

export const getUnreadMessagesCount = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving unread messages count...");
  authenticate(mongoClient, postReq, postRes)
		.then(res => {
			const [db, findRes] = res;

			const userId = findRes._id.toString();

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
							unreadMessages: 0,
						});
						return;
					}

					// console.log("Conversations length:", findRes.length);

					const filteredConversations = findRes.filter(conversation => {
						const isHost = userId === conversation.host;
						const isRead = (isHost && conversation.isPrimaryRead) || (!isHost && conversation.isSecondaryRead);

						const messages = conversation.messages;

						return !isRead && messages.length > 0;
					});

					console.log("Unread messages count retrieved");
					db.close();
					postSuccess(postRes, {
						unreadMessages: filteredConversations.length,
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
				Request: getUnreadMessagesCount
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
