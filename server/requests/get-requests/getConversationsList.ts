import mongodb from "mongodb";

import {
  authenticate,
  getOtherUser,
  postSuccess,
  postFailure
} from "./../../utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE
} from "./../../constants";

const ObjectId = mongodb.ObjectID;

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
			const currentUserFirstName = findRes.firstName;

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

					console.log("Conversations length:", findRes.length);

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

										const firstName = findUserRes.firstName;
										const otherUserId = findUserRes._id.toString();

										const messages = conversation.messages;

										const lastMessage = messages[messages.length - 1];
										if (lastMessage) {
											Object.assign(lastMessage, {
												firstName:
													lastMessage.userId === userId
														? currentUserFirstName
														: findUserRes.firstName
											});
										}

										const conversationId = conversation._id.toString();

										resolve({
											conversationId,
											firstName,
											userId: otherUserId,
											lastMessage
										});
									}
								);
						});
					});

					Promise.all(conversationsListPromises).then(conversationsList => {
						conversationsList = conversationsList.filter(
							conversationsList => !!conversationsList
						);

						console.log("Conversations list retrieved");
						db.close();
						postSuccess(postRes, {
							conversationsList
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
    });
};
