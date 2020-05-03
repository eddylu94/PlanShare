import mongodb from "mongodb";

import {
  authenticate,
  getDomain,
  getOtherUser,
  postSuccess,
  postFailure
} from "./../utils";
import {
  subscriptionCategories,
  retrieveSubscriptionBrands
} from "./../subscriptions";
import { retrieveOrganizationByDomain } from "./../organizations";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  SORT_BY,
  SUBSCRIPTION_STATUS,
  ACCOUNT_STATUS
} from "./../constants";

const ObjectId = mongodb.ObjectID;

export const getValidationEmail = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving validation email...");

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connerErr, db) => {
    if (connerErr) throw connerErr;

    const headerAuthorization = postReq.headers.authorization;
    const authKey = headerAuthorization.replace("Bearer ", "");

    const dbo = db.db(DATABASE_NAME);
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ "authTokens.key": authKey }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
          throw findErr;
        }

        if (!findRes) {
          console.log("Unable to find account for validation");
          db.close();
          postFailure(
            postRes,
            STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          );
          return;
        }

        const email: string = findRes.email;

        if (findRes.status === ACCOUNT_STATUS.LIVE) {
          console.log("Email already validated");
        }

        console.log("Email retrieved:", email);
        db.close();
        postSuccess(postRes, {});
      });
  });
};

export const getSubscriptionCategories = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription categories...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const defaultSubscriptionCategory = subscriptionCategories[0];

      db.close();
      postSuccess(postRes, {
        subscriptionCategories: subscriptionCategories,
        defaultSubscriptionCategory
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscriptionBrands = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription brand...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const query = postReq.query;

      const subscriptionCategory = query.subscriptionCategory;
      const subscriptionBrands = retrieveSubscriptionBrands(
        subscriptionCategory
      );

      const defaultSubscriptionBrand = subscriptionBrands[0];

      db.close();
      postSuccess(postRes, {
        subscriptionBrands,
        defaultSubscriptionBrand
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscriptions = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const email = findRes.email;

      const { t, sc, gs, sb, da, p } = postReq.query;

      const subscriptionCategories = sc.split(",");

      let [minGroupSize, maxGroupSize] = gs
        ? gs.split(",").map((val: string) => parseInt(val))
        : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

      let [minPrice, maxPrice] = p
        ? p.split(",").map((val: string) => parseInt(val))
        : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

      let sort: any;
      switch (sb) {
        case SORT_BY.DATE_DES:
          sort = { createdDate: -1 };
          break;
        case SORT_BY.DATE_ASC:
          sort = { createdDate: 1 };
          break;
        case SORT_BY.SUBSCRIPTION_BRAND_ASC:
          sort = { "subscriptionBrand.name": 1 };
          break;
        case SORT_BY.SUBSCRIPTION_BRAND_DES:
          sort = { "subscriptionBrand.name": -1 };
          break;
        default:
          sort = { createdDate: -1 };
          break;
      }

      const dbo = db.db(DATABASE_NAME);

      const currentDate = new Date();
      const oldestDate = new Date(
        new Date().setDate(new Date().getDate() - parseInt(da) - 1)
      );

      const domain = getDomain(email);
      const organization = retrieveOrganizationByDomain(domain);
      const organizationId = organization && organization.organizationId;

      const findQuery = {
        "organization.organizationId": organizationId,
        "subscriptionBrand.type": { $in: subscriptionCategories },
        numberOfPeople: {
          $gte: minGroupSize,
          $lte: maxGroupSize
        },
        price: {
          $gte: minPrice,
          $lte: maxPrice
        },
        createdDate: {
          $lte: new Date(currentDate),
          $gte: new Date(oldestDate)
        },
        status: SUBSCRIPTION_STATUS.ACTIVE
      };

      if (t.length) {
        Object.assign(findQuery, {
          $text: { $search: t }
        });
      }

      console.log("asfasfsa");
      console.log(findQuery);

      return dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .find(findQuery)
        .sort(sort)
        .toArray()
        .then(findRes => {
          if (!findRes) {
            console.log("Unable to find subscriptions");
            db.close();
            postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
            return;
          }

          db.close();
          postSuccess(postRes, {
            subscriptions: findRes
          });
        })
        .catch(findErr => {
          if (findErr) {
            console.log("Error finding record");
            console.log(findErr);
            db.close();
            postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
          }
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscription...");
  authenticate(mongoClient, postReq, postRes).then(res => {
    const [db, findRes] = res;

    const email = findRes.email;
    const domain = getDomain(email);

    const { subscriptionId } = postReq.query;

    console.log(subscriptionId);

    const dbo = db.db(DATABASE_NAME);

    return dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .findOne(
        { _id: new ObjectId(subscriptionId) },
        (findErr, subscriptionFindRes) => {
          console.log(subscriptionFindRes.subscriptionBrand.name);

          const organization = retrieveOrganizationByDomain(domain);
          const organizationId = organization && organization.organizationId;

          if (!organizationId === subscriptionFindRes.organizationId) {
            console.log(
              "User does not belong in organization of selected subscription"
            );
            db.close();
            postFailure(
              postRes,
              STATUS_MESSAGE.USER_NOT_MEMBER_OF_ORGANIZATION
            );
            return;
          }

          if (
            !(
              findRes._id.toString() === subscriptionFindRes.userId ||
              subscriptionFindRes.status === SUBSCRIPTION_STATUS.ACTIVE
            )
          ) {
            console.log("User does not have access to subscription");
            db.close();
            postFailure(
              postRes,
              STATUS_MESSAGE.USER_REQUIRES_ACCESS_FOR_SUBSCRIPTION
            );
            return;
          }

          db.close();
          postSuccess(postRes, {
            subscriptionData: subscriptionFindRes
          });
        }
      );
  });
};

export const getProfile = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving profile...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { firstName, email, joinedDate } = findRes;

      const { profileUserId } = postReq.query;

      if (!profileUserId) {
        const domain = getDomain(email);
        const organization = retrieveOrganizationByDomain(domain);

        const profileData = {
          firstName,
          organization,
          joinedDate
        };

        console.log("Profile retrieved:", profileData);
        db.close();
        postSuccess(postRes, { profileData });
      } else {
        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .findOne(
            { _id: new ObjectId(profileUserId) },
            (findProfileErr, findProfileRes) => {
              if (findProfileErr) {
                postFailure(postRes, STATUS_MESSAGE.PROFILE_NOT_FOUND);
              }
              if (findProfileRes) {
                const { firstName, joinedDate } = findProfileRes;

                const otherUserEmail = findProfileRes.email;

                const currentUserDomain = getDomain(findRes.email);

                const otherUserDomain = getDomain(otherUserEmail);

                let otherUserOrganization;
                if (currentUserDomain === otherUserDomain) {
                  otherUserOrganization = retrieveOrganizationByDomain(
                    otherUserDomain
                  );
                }

                const profileData = {
                  firstName,
                  organization: otherUserOrganization,
                  joinedDate
                };

                console.log("Profile retrieved:", profileData);
                db.close();
                postSuccess(postRes, { profileData });
              }
            }
          );
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSubscriptionsByAuthor = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions by author...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const findResEmail = findRes.email;
      const userId = findRes._id;

      const { profileUserId } = postReq.query;

      if (profileUserId) {
        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .findOne(
            { _id: new ObjectId(profileUserId) },
            (findProfileErr, findProfileRes) => {
              if (findProfileErr) {
                postFailure(postRes, STATUS_MESSAGE.PROFILE_NOT_FOUND);
              }
              if (findProfileRes) {
                const findProfileResEmail = findProfileRes.email;

                const currentUserDomain = getDomain(findRes.email);

                const email =
                  currentUserDomain === getDomain(findProfileResEmail)
                    ? findProfileResEmail
                    : undefined;

                if (!email) {
                  console.log("Unable to find subscriptions");
                  db.close();
                  postFailure(
                    postRes,
                    STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS
                  );
                  return;
                }

                const domain = getDomain(email);
                const organization = retrieveOrganizationByDomain(domain);
                const organizationId =
                  organization && organization.organizationId;

                dbo
                  .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
                  .find({
                    userId: new ObjectId(profileUserId),
                    "organization.organizationId": organizationId,
                    status: SUBSCRIPTION_STATUS.ACTIVE
                  })
                  .toArray()
                  .then(findRes => {
                    if (!findRes) {
                      console.log("Unable to find subscriptions");
                      db.close();
                      postFailure(
                        postRes,
                        STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS
                      );
                      return;
                    }

                    db.close();
                    postSuccess(postRes, {
                      findRes
                    });
                  })
                  .catch(findErr => {
                    if (findErr) {
                      console.log("Error finding record");
                      db.close();
                      postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
                    }
                  });
              }
            }
          );
      } else {
        const dbo = db.db(DATABASE_NAME);

        const domain = getDomain(findResEmail);
        const organization = retrieveOrganizationByDomain(domain);
        const organizationId = organization && organization.organizationId;

        dbo
          .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
          .find({
            userId: new ObjectId(userId),
            "organization.organizationId": organizationId,
            status: SUBSCRIPTION_STATUS.ACTIVE
          })
          .toArray()
          .then(findRes => {
            if (!findRes) {
              console.log("Unable to find subscriptions");
              db.close();
              postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
              return;
            }

            db.close();
            postSuccess(postRes, {
              subscriptions: findRes
            });
          })
          .catch(findErr => {
            if (findErr) {
              console.log("Error finding record");
              db.close();
              postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
            }
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const getArchivedSubscriptions = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions by author...");
  authenticate(mongoClient, postReq, postRes).then(res => {
    const [db, findRes] = res;

    const userId = findRes._id;

    const dbo = db.db(DATABASE_NAME);

    dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .find({
        userId: new ObjectId(userId),
        status: SUBSCRIPTION_STATUS.DELISTED
      })
      .toArray()
      .then(findSubscriptionsRes => {
        if (!findSubscriptionsRes) {
          console.log("Unable to find subscriptions");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
          return;
        }

        console.log("Archived subscriptions retrieved");

        db.close();
        postSuccess(postRes, {
          subscriptions: findSubscriptionsRes
        });
      })
      .catch(findErr => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
        }
      });
  });
};

export const getEmailAddress = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving email address...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { email } = findRes;

      db.close();
      postSuccess(postRes, {
        email
      });
    })
    .catch(err => {
      console.log(err);
    });
};

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

                    db.close();
                    postSuccess(postRes, {
                      conversation: {
                        conversationId: findConversationRes._id,
                        firstName: findOtherUserRes.firstName.toString(),
                        userId: findOtherUserRes._id.toString(),
                        messages: findConversationRes.messages
                      }
                    });
                  }
                );
            }
          }
        );
    })
    .catch(err => {
      console.log(err);
    });
};

export const getConversationsList = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving conversations list...");
  authenticate(mongoClient, postReq, postRes).then(res => {
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

        if (!findRes.length) {
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
  });
};
