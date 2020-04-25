import mongodb from "mongodb";

import {
  authenticate,
  getDomain,
  isOverlappingDomains,
  getOtherUser
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
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  SORT_BY
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
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
          throw findErr;
        }

        if (!findRes) {
          console.log("Unable to find account for validation");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          });
          return;
        }

        const email: string = findRes.email;

        if (findRes.emails.indexOf(email) >= 0) {
          console.log("Email already validated");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            statusMessage: STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED
          });
          return;
        }

        console.log("Email retrieved:", email);
        db.close();
        postRes.json({
          statusCode: STATUS_CODE.SUCCESS,
          body: {
            email
          }
        });
      });
  });
};

export const getOrganizations = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving organizations...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const emails = findRes.emails;

      const organizations = emails
        .map(currentEmail => getDomain(currentEmail))
        .map(currentEmailDomain =>
          retrieveOrganizationByDomain(currentEmailDomain)
        );

      const defaultOrganization = organizations[0];

      console.log("Organization retrieved:", organizations[0]);
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          organizations,
          defaultOrganization
        }
      });
    })
    .catch(err => {
      console.log(err);
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
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          subscriptionCategories: subscriptionCategories,
          defaultSubscriptionCategory
        }
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
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          subscriptionBrands,
          defaultSubscriptionBrand
        }
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

      const emails = findRes.emails;

      const { t, o, sc, gs, sb, da, p } = postReq.query;

      const subscriptionOrganizations = o.split(",");

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

      const promises = emails
        .map(email => getDomain(email))
        .map(domain => retrieveOrganizationByDomain(domain))
        .map((organization: any) => organization.organizationId)
        .filter(organizationId =>
          subscriptionOrganizations.includes(organizationId)
        )
        .map(organizationId => {
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
            }
          };

          if (t.length) {
            Object.assign(findQuery, {
              $text: { $search: t }
            });
          }

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
                postRes.json({
                  statusCode: STATUS_CODE.FAILURE,
                  statusMessage: STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS
                });
                return;
              }

              return findRes;
            })
            .catch(findErr => {
              if (findErr) {
                console.log("Error finding record");
                db.close();
                postRes.json({
                  statusCode: STATUS_CODE.FAILURE,
                  statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
                });
              }
            });
        });

      Promise.all(promises).then(results => {
        const subscriptions = results.reduce(
          (acc, curr) => acc.concat(curr),
          [] as any
        );
        // console.log(subscriptions);

        db.close();
        postRes.json({
          statusCode: STATUS_CODE.SUCCESS,
          body: {
            subscriptions
          }
        });
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

    const emails = findRes.emails;
    const domains = emails.map(email => getDomain(email));

    const { subscriptionId } = postReq.query;

    console.log(subscriptionId);

    const dbo = db.db(DATABASE_NAME);

    return dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .findOne({ _id: new ObjectId(subscriptionId) }, (findErr, findRes) => {
        console.log(findRes.subscriptionBrand.name);

        const organizationIds = domains
          .map(domain => retrieveOrganizationByDomain(domain))
          .map(organization => organization && organization.organizationId);

        if (!organizationIds.includes(findRes.organizationId)) {
          console.log(
            "User does not belong in organization of selected subscription"
          );
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.USER_NOT_MEMBER_OF_ORGANIZATION
          });
          return;
        }

        db.close();
        postRes.json({
          statusCode: STATUS_CODE.SUCCESS,
          body: {
            subscriptionData: findRes
          }
        });
      });
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

      const { firstName, emails, joinedDate } = findRes;

      const { profileUserId } = postReq.query;

      if (!profileUserId) {
        const organizations = emails.map(currentEmail => {
          const domain = getDomain(currentEmail);
          const organization = retrieveOrganizationByDomain(domain);

          return {
            email: currentEmail,
            organization
          };
        });

        const profileData = {
          firstName,
          organizations,
          joinedDate
        };

        console.log("Profile retrieved:", profileData);
        db.close();
        postRes.json({
          statusCode: STATUS_CODE.SUCCESS,
          body: { profileData }
        });
      } else {
        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .findOne(
            { _id: new ObjectId(profileUserId) },
            (findProfileErr, findProfileRes) => {
              if (findProfileErr) {
                postRes.json({
                  statusCode: STATUS_CODE.FAILURE,
                  statusMessage: STATUS_MESSAGE.PROFILE_NOT_FOUND
                });
              }
              if (findProfileRes) {
                const { firstName, joinedDate, emails } = findProfileRes;

                const currentUserDomains = findRes.emails.map(
                  (currentEmail: string) => getDomain(currentEmail)
                );

                const organizations = emails
                  .map((currentEmail: string) => {
                    const domain = getDomain(currentEmail);

                    if (currentUserDomains.includes(domain)) {
                      const organization = retrieveOrganizationByDomain(domain);

                      return {
                        email: currentEmail,
                        organization
                      };
                    }
                  })
                  .filter((organization: any) => !!organization);

                const profileData = {
                  firstName,
                  organizations,
                  joinedDate
                };

                console.log("Profile retrieved:", profileData);
                db.close();
                postRes.json({
                  statusCode: STATUS_CODE.SUCCESS,
                  body: { profileData }
                });
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

      const findResEmails = findRes.emails;
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
                postRes.json({
                  statusCode: STATUS_CODE.FAILURE,
                  statusMessage: STATUS_MESSAGE.PROFILE_NOT_FOUND
                });
              }
              if (findProfileRes) {
                const findProfileResEmails = findProfileRes.emails;

                const currentUserDomains = findRes.emails.map(
                  (currentEmail: string) => getDomain(currentEmail)
                );

                const emails = findProfileResEmails
                  .map((currentEmail: string) => {
                    const domain = getDomain(currentEmail);

                    if (currentUserDomains.includes(domain)) {
                      return currentEmail;
                    }
                  })
                  .filter((organization: any) => !!organization) as string[];

                const promises = emails
                  .map(email => getDomain(email))
                  .map(domain => retrieveOrganizationByDomain(domain))
                  .map((organization: any) => organization.organizationId)
                  .map((organizationId: string) => {
                    return dbo
                      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
                      .find({
                        userId: new ObjectId(profileUserId),
                        "organization.organizationId": organizationId
                      })
                      .toArray()
                      .then(findRes => {
                        if (!findRes) {
                          console.log("Unable to find subscriptions");
                          db.close();
                          postRes.json({
                            statusCode: STATUS_CODE.FAILURE,
                            statusMessage:
                              STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS
                          });
                          return;
                        }

                        return findRes;
                      })
                      .catch(findErr => {
                        if (findErr) {
                          console.log("Error finding record");
                          db.close();
                          postRes.json({
                            statusCode: STATUS_CODE.FAILURE,
                            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
                          });
                        }
                      });
                  });

                Promise.all(promises).then(results => {
                  const subscriptions = results.reduce(
                    (acc, curr) => acc.concat(curr),
                    [] as any
                  );
                  // console.log(subscriptions);

                  db.close();
                  postRes.json({
                    statusCode: STATUS_CODE.SUCCESS,
                    body: {
                      subscriptions
                    }
                  });
                });
              }
            }
          );
      } else {
        const dbo = db.db(DATABASE_NAME);

        const promises = findResEmails
          .map(email => getDomain(email))
          .map(domain => retrieveOrganizationByDomain(domain))
          .map((organization: any) => organization.organizationId)
          .map((organizationId: string) => {
            return dbo
              .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
              .find({
                userId: new ObjectId(userId),
                "organization.organizationId": organizationId
              })
              .toArray()
              .then(findRes => {
                if (!findRes) {
                  console.log("Unable to find subscriptions");
                  db.close();
                  postRes.json({
                    statusCode: STATUS_CODE.FAILURE,
                    statusMessage: STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS
                  });
                  return;
                }

                return findRes;
              })
              .catch(findErr => {
                if (findErr) {
                  console.log("Error finding record");
                  db.close();
                  postRes.json({
                    statusCode: STATUS_CODE.FAILURE,
                    statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
                  });
                }
              });
          });

        Promise.all(promises).then(results => {
          const subscriptions = results.reduce(
            (acc, curr) => acc.concat(curr),
            [] as any
          );
          // console.log(subscriptions);

          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            body: {
              subscriptions
            }
          });
        });
      }
    })
    .catch(err => {
      console.log(err);
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
      postRes.json({
        statusCode: STATUS_CODE.SUCCESS,
        body: {
          email
        }
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

      const currentUserEmails = findRes.emails;
      const currentUserId = findRes._id.toString();

      const { userId } = postReq.query;

      if (currentUserId === userId) {
        db.close();
        postRes.json({
          statusCode: STATUS_CODE.FAILURE,
          statusMessage: STATUS_MESSAGE.CANNOT_FIND_CONVERSATION
        });
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
              postRes.json({
                statusCode: STATUS_CODE.FAILURE,
                statusMessage: STATUS_MESSAGE.PROFILE_NOT_FOUND
              });
              return;
            }
            if (findProfileRes) {
              const userEmails = findProfileRes.emails;
              const userDomains = userEmails.map((email: string) =>
                getDomain(email)
              );

              const currentUserDomains = currentUserEmails.map(
                (email: string) => getDomain(email)
              );

              const isValid = isOverlappingDomains(
                currentUserDomains,
                userDomains
              );
              if (isValid) {
                dbo
                  .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
                  .findOne(
                    { userIds: { $all: [currentUserId, userId] } },
                    (findConversationErr, findConversationRes) => {
                      if (findConversationErr) {
                        db.close();
                        postRes.json({
                          statusCode: STATUS_CODE.FAILURE,
                          statusMessage: STATUS_MESSAGE.CANNOT_FIND_CONVERSATION
                        });
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
                                postRes.json({
                                  statusCode: STATUS_CODE.FAILURE,
                                  statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
                                });
                                throw insertErr;
                              }

                              console.log("Conversation created");
                              db.close();
                              postRes.json({
                                statusCode: STATUS_CODE.SUCCESS,
                                body: {
                                  conversation: {
                                    conversationId: insertRes.insertedId,
                                    firstName: findProfileRes.firstName,
                                    messages: []
                                  }
                                }
                              });
                            }
                          );

                        return;
                      } else {
                        console.log("Conversation retrieved");
                        db.close();
                        postRes.json({
                          statusCode: STATUS_CODE.SUCCESS,
                          body: {
                            conversation: {
                              conversationId: findConversationRes._id,
                              firstName: findProfileRes.firstName,
                              messages: findConversationRes.messages
                            }
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

      const dbo = db.db(DATABASE_NAME);
      dbo
        .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
        .findOne(
          { _id: new ObjectId(conversationId) },
          (findConversationErr, findConversationRes) => {
            if (findConversationErr) {
              db.close();
              postRes.json({
                statusCode: STATUS_CODE.FAILURE,
                statusMessage: STATUS_MESSAGE.CANNOT_FIND_CONVERSATION
              });

              return;
            }

            if (findConversationRes) {
              const { userIds } = findConversationRes;

              if (!userIds.includes(userId)) {
                db.close();
                postRes.json({
                  statusCode: STATUS_CODE.FAILURE,
                  statusMessage: STATUS_MESSAGE.CANNOT_FIND_CONVERSATION
                });

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
                      postRes.json({
                        statusCode: STATUS_CODE.FAILURE,
                        statusMessage: STATUS_MESSAGE.CANNOT_FIND_CONVERSATION
                      });

                      return;
                    }

                    db.close();
                    postRes.json({
                      statusCode: STATUS_CODE.SUCCESS,
                      body: {
                        conversation: {
                          conversationId: findConversationRes._id,
                          firstName: findOtherUserRes.firstName.toString(),
                          messages: findConversationRes.messages
                        }
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
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.CANNOT_FIND_CONVERSATIONS_LIST
          });
          return;
        }

        if (!findRes.length) {
          console.log("Conversations list empty");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            body: {
              conversationsList: []
            }
          });
          return;
        }

        console.log(findRes);

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
                    postRes.json({
                      statusCode: STATUS_CODE.FAILURE,
                      statusMessage:
                        STATUS_MESSAGE.CANNOT_FIND_CONVERSATIONS_LIST
                    });
                    return;
                  }

                  const firstName = findUserRes.firstName;

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
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            body: {
              conversationsList
            }
          });
        });

        return findRes;
      })
      .catch(findErr => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
        }
      });
  });
};
