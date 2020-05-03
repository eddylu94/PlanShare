import mongodb from "mongodb";

import socketIo from "socket.io";

import { EMAIL_SERVICE_EMAIL, transporter } from "./../email-service";
import { retrieveOrganizationById } from "./../organizations";
import {
  encryptPassword,
  comparePassword,
  IPendingEmail,
  authenticate,
  generateConfirmationCode,
  generateAuthToken
} from "./../utils";
import {
  TITLE,
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  SUBSCRIPTION_STATUS,
  ACCOUNT_STATUS
} from "./../constants";

const ObjectId = mongodb.ObjectID;

export const signUp = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Signing up...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      console.log("Connection error");
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.FAILURE,
        statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
      });
      throw connectErr;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user already exists
    const email = obj.email.toLocaleLowerCase();
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ email }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
          throw findErr;
        }

        if (!!findRes) {
          console.log("Email address already exists:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.EMAIL_ALREADY_EXISTS
          });
          return;
        }

        const confirmationCode = generateConfirmationCode();

        const authToken = generateAuthToken();
        Object.assign(obj, {
          joinedDate: new Date().getTime(),
          authTokens: [authToken],
          status: ACCOUNT_STATUS.PENDING_VERIFICATION,
          confirmationCode
        });

        const plainPass = obj.pass;
        delete obj.pass;

        const addUser = (err: any, hash: any) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!hash) {
            return;
          }

          obj.pass = hash;

          // Insert user into database
          dbo
            .collection(DATABASE_COLLECTION.USERS_COLLECTION)
            .insertOne(obj, (insertErr, insertRes) => {
              if (insertErr) {
                console.log("Error inserting record");
                db.close();
                postRes.json({
                  statusCode: STATUS_CODE.FAILURE,
                  statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
                });
                throw insertErr;
              }

              console.log("User created:", email);
              db.close();
              postRes.json({
                statusCode: STATUS_CODE.SUCCESS,
                body: {
                  userId: insertRes.insertedId,
                  auth: authToken.key,
                  firstName: obj.firstName
                }
              });

              const mailSubject = `Welcome to ${TITLE}`;
              const mailMessage = `Thank you for registering for ${TITLE}!<br /><br />Your confirmation code is:<br /><span style="font-weight: bold;">${confirmationCode}</span>`;

              const mailOptions = {
                from: EMAIL_SERVICE_EMAIL,
                to: email,
                subject: mailSubject,
                html: mailMessage
              };

              transporter.sendMail(mailOptions, function(sendErr, info) {
                if (sendErr) {
                  console.log("Error sending email");
                  console.log(sendErr);
                  transporter.sendMail(mailOptions, function(sendErr, info) {
                    if (sendErr) {
                      console.log("Error sending email");
                      console.log(sendErr);
                      transporter.sendMail(mailOptions, function(
                        sendErr,
                        info
                      ) {
                        if (sendErr) {
                          console.log("Error sending email");
                          console.log(sendErr);
                          throw sendErr;
                        } else {
                          console.log("Email sent: " + info.response);
                        }
                      });
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  });
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            });
        };

        encryptPassword(plainPass, addUser);
      });
  });
};

export const login = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Logging in...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      console.log("Connection error");
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.FAILURE,
        statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
      });
      throw connectErr;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user exists
    const email = obj.email.toLocaleLowerCase();
    const { pass } = obj;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ email }, (findErr, findRes) => {
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
          console.log("Email address does not exist:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.INCORRECT_CRED
          });
          return;
        }

        const authenticateUser = (err: any, isPasswordMatch: any) => {
          if (err) {
            console.log(err);
            return;
          }

          if (isPasswordMatch === false) {
            console.log("Incorrect password:", email);
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.FAILURE,
              statusMessage: STATUS_MESSAGE.INCORRECT_CRED
            });
            return;
          } else if (isPasswordMatch === true) {
            const userId = findRes._id;
            const { firstName } = findRes;

            const authToken = generateAuthToken();

            dbo
              .collection(DATABASE_COLLECTION.USERS_COLLECTION)
              .updateOne(
                { _id: findRes._id },
                { $push: { authTokens: authToken } }
              )
              .then(() => {
                console.log("User logged in:", email);
                db.close();
                postRes.json({
                  statusCode: STATUS_CODE.SUCCESS,
                  body: {
                    userId: userId.toString(),
                    auth: authToken.key,
                    firstName
                  }
                });
              });
          }
        };

        comparePassword(pass, findRes.pass, authenticateUser);
      });
  });
};

export const verifyEmail = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Verifying email...");

  const obj = postReq.body;

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

        if (findRes.status === ACCOUNT_STATUS.LIVE) {
          console.log("Email already validated");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            statusMessage: STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED
          });
          return;
        }

        const confirmationCode = findRes.confirmationCode;

        if (!confirmationCode) {
          console.log("Unable to find pending account for validation");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          });
          return;
        }

        if (confirmationCode !== obj.validationCode) {
          console.log("Incorrect validation code");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.INCORRECT_VALIDATION_CODE
          });
          return;
        }

        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .updateOne(
            { _id: findRes._id },
            { $set: { status: ACCOUNT_STATUS.LIVE } }
          )
          .then(() => {
            console.log("Email validated:", email);
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.SUCCESS
            });
          })
          .catch((error: any) => {
            console.log(error);
          });
      });
  });
};

export const createSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Creating subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { firstName } = findRes;

      const { subscriptionData } = obj;

      const organization = retrieveOrganizationById(
        subscriptionData.organizationId
      );

      Object.assign(subscriptionData, {
        userId: findRes._id,
        firstName,
        organization,
        createdDate: new Date(),
        numberOfPeople: parseInt(subscriptionData.numberOfPeople),
        price: parseFloat(subscriptionData.price),
        subscriptionBrandName: subscriptionData.subscriptionBrand.name,
        status: SUBSCRIPTION_STATUS.ACTIVE
      });

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .insertOne(subscriptionData, (insertErr, insertRes) => {
          if (insertErr) {
            console.log("Error inserting record");
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.FAILURE,
              statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
            });
            throw insertErr;
          }

          const subscriptionId = insertRes.insertedId;

          console.log("Subscription created:", subscriptionId);

          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            body: {
              subscriptionId
            }
          });
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const editSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Editing subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { firstName } = findRes;

      const { subscriptionData } = obj;

      const { subscriptionId } = subscriptionData;

      const organization = retrieveOrganizationById(
        subscriptionData.organizationId
      );

      Object.assign(subscriptionData, {
        firstName,
        organization,
        editedDate: new Date(),
        numberOfPeople: parseInt(subscriptionData.numberOfPeople),
        price: parseFloat(subscriptionData.price),
        subscriptionBrandName: subscriptionData.subscriptionBrand.name
      });

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .updateOne(
          { _id: new ObjectId(subscriptionId) },
          { $set: { ...subscriptionData } }
        )
        .then(() => {
          console.log("Subscription updated:", subscriptionId);

          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            body: {
              subscriptionId
            }
          });
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const archiveSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Archiving subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { subscriptionId } = obj;

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .updateOne(
          { _id: new ObjectId(subscriptionId) },
          { $set: { status: SUBSCRIPTION_STATUS.DELISTED } }
        )
        .then(() => {
          console.log("Subscription archived:", subscriptionId);

          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            body: {}
          });
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const deleteSubscription = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Deleting subscription...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { subscriptionId } = obj;

      const dbo = db.db(DATABASE_NAME);

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .deleteOne({ _id: new ObjectId(subscriptionId) })
        .then(() => {
          console.log("Subscription deleted:", subscriptionId);

          db.close();
          postRes.json({
            statusCode: STATUS_CODE.SUCCESS,
            body: {}
          });
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const deleteUser = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Deleting user...");

  const obj = postReq.body;

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      console.log("Connection error");
      db.close();
      postRes.json({
        statusCode: STATUS_CODE.FAILURE,
        statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
      });
      throw connectErr;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user exists
    const email = obj.email.toLocaleLowerCase();
    const { pass } = obj;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ email }, (findErr, findRes) => {
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
          console.log("Email address does not exist:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.INCORRECT_CRED
          });
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
            postRes.json({
              statusCode: STATUS_CODE.FAILURE,
              statusMessage: STATUS_MESSAGE.INCORRECT_CRED
            });
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
                postRes.json({
                  statusCode: STATUS_CODE.SUCCESS,
                  body: {}
                });
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

              const messageData = {
                userId,
                date: new Date(),
                message
              };

              dbo
                .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
                .updateOne(
                  { _id: new ObjectId(conversationId) },
                  { $push: { messages: messageData } }
                )
                .then(() => {
                  io.emit("message sent", "Hello World !");

                  db.close();
                  postRes.json({
                    statusCode: STATUS_CODE.SUCCESS,
                    body: {}
                  });
                });
            }
          }
        );
    })
    .catch(err => {
      console.log(err);
    });
};
