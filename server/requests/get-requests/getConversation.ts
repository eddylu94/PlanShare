import mongodb from "mongodb";

import {
  authenticate,
  getDomain,
  postSuccess,
  postFailure
} from "./../../utils";
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

      const currentUserEmail = findRes.email;
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
              const userEmail = findProfileRes.email;
              const userDomain = getDomain(userEmail);

              const currentUserDomain = getDomain(currentUserEmail);

              if (currentUserDomain === userDomain) {
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
                          messages: []
                        };

                        dbo
                          .collection(
                            DATABASE_COLLECTION.CONVERSATIONS_COLLECTION
                          )
                          .insertOne(
                            conversationData,
                            (insertErr, insertRes) => {
                              if (insertErr) {
                                console.log("Error inserting record");
                                db.close();
                                postFailure(
                                  postRes,
                                  STATUS_MESSAGE.UNKNOWN_ERROR
                                );
                                throw insertErr;
                              }

                              console.log("Conversation created");
                              db.close();
                              postSuccess(postRes, {
                                conversation: {
                                  conversationId: insertRes.insertedId,
                                  firstName: findProfileRes.firstName,
                                  userId: findProfileRes._id.toString(),
                                  messages: []
                                }
                              });
                            }
                          );

                        return;
                      } else {
                        console.log("Conversation retrieved");
                        db.close();
                        postSuccess(postRes, {
                          conversation: {
                            conversationId: findConversationRes._id,
                            firstName: findProfileRes.firstName,
                            userId: findProfileRes._id.toString(),
                            messages: findConversationRes.messages
                          }
                        });
                      }
                    }
                  );
              }
            }
          }
        );
    })
    .catch(err => {
      console.log(err);
    });
};
