import mongodb from "mongodb";

import socketIo from "socket.io";

import { EMAIL_SERVICE_EMAIL, transporter } from "./../email-service";
import {
  retrieveOrganizationById,
  retrieveOrganizationByDomain
} from "./../organizations";
import {
  encryptPassword,
  comparePassword,
  authenticate,
  generateConfirmationCode,
  generateAuthToken,
  getDomain,
  postSuccess,
  postFailure
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
  ACCOUNT_STATUS,
  MAX_AUTH_ATTEMPTS,
  ALLOWABLE_TIME_FOR_AUTH_ATTEMPTS,
  ACCOUNT_LOCK_PERIOD,
  ACCOUNT_VALIDATE_LOCK_PERIOD,
  ALLOWABLE_TIME_FOR_VALIDATE_ATTEMPTS,
  MAX_VALIDATE_ATTEMPTS
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
      postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
      throw connectErr;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user already exists
    const username = obj.username.toLocaleLowerCase();
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ username }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
          throw findErr;
        }

        if (!!findRes) {
          console.log("Username already exists:", username);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.USERNAME_ALREADY_EXISTS);
          return;
        }

        const authToken = generateAuthToken();
        Object.assign(obj, {
          joinedDate: new Date().getTime(),
          authTokens: [authToken],
          status: ACCOUNT_STATUS.PENDING_VERIFICATION
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
                postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
                throw insertErr;
              }

              console.log("User created:", username);
              db.close();
              postRes.json({
                statusCode: STATUS_CODE.SUCCESS,
                body: {
                  userId: insertRes.insertedId,
                  auth: authToken.key,
                  firstName: obj.firstName
                }
              });
            });
        };

        encryptPassword(plainPass, addUser);
      });
  });
};

export const addEmail = (
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

        if (findRes.status === ACCOUNT_STATUS.LIVE) {
          console.log("Email already validated");
          db.close();
          postSuccess(postRes, {});
          return;
        }

        if (findRes.email) {
          console.log("Email already added");
          db.close();
          postSuccess(postRes, {});
          return;
        }

        const email = obj.email;

        const confirmationCode = generateConfirmationCode();

        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .updateOne(
            { _id: findRes._id },
            { $set: { email, confirmationCode } }
          )
          .then(() => {
            console.log("Email added:", email);
            db.close();
            postSuccess(postRes, {});

            const username = findRes.username;

            const mailSubject = `Welcome to ${TITLE}`;
            const mailMessage = `Thank you for registering for ${TITLE}!<br /><br />Your username is:<br /><span style="font-weight: bold;">${username}</span><br /><br />Your confirmation code is:<br /><span style="font-weight: bold;">${confirmationCode}</span>`;

            const mailOptions = {
              from: EMAIL_SERVICE_EMAIL,
              to: email,
              subject: mailSubject,
              html: mailMessage
            };

            let attempts = 0;
            const SEND_EMAIL_MAX_NUMBER_OF_ATTEMPTS = 5;

            const sendEmail = () => {
              attempts++;
              transporter.sendMail(mailOptions, function(sendErr, info) {
                if (sendErr) {
                  console.log("Error sending email");
                  console.log(sendErr);
                  if (attempts <= SEND_EMAIL_MAX_NUMBER_OF_ATTEMPTS) {
                    sendEmail();
                  }
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            };

            sendEmail();
          })
          .catch((error: any) => {
            console.log(error);
          });
      });
  });
};

export const resendConfirmationCode = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Sending new confirmation code...");

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

        if (findRes.status === ACCOUNT_STATUS.LIVE) {
          console.log("Email already validated");
          db.close();
          postSuccess(postRes, {});
          return;
        }

        const email = findRes.email;

        const confirmationCode = generateConfirmationCode();

        const dbo = db.db(DATABASE_NAME);
        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .updateOne({ _id: findRes._id }, { $set: { confirmationCode } })
          .then(() => {
            console.log("New confirmation code sent:", email);
            db.close();
            postSuccess(postRes, {});

            const mailSubject = `Verify your email`;
            const mailMessage = `Here is your new confirmation code:<br /><span style="font-weight: bold;">${confirmationCode}</span>`;

            const mailOptions = {
              from: EMAIL_SERVICE_EMAIL,
              to: email,
              subject: mailSubject,
              html: mailMessage
            };

            let attempts = 0;
            const SEND_EMAIL_MAX_NUMBER_OF_ATTEMPTS = 5;

            const sendEmail = () => {
              attempts++;
              transporter.sendMail(mailOptions, function(sendErr, info) {
                if (sendErr) {
                  console.log("Error sending email");
                  console.log(sendErr);
                  if (attempts <= SEND_EMAIL_MAX_NUMBER_OF_ATTEMPTS) {
                    sendEmail();
                  }
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            };

            sendEmail();
          })
          .catch((error: any) => {
            console.log(error);
          });
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
      postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
      throw connectErr;
    }

    const dbo = db.db(DATABASE_NAME);

    // Verify if user exists
    const username = obj.username.toLocaleLowerCase();
    const { pass } = obj;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .findOne({ username }, (findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
          throw findErr;
        }

        if (!findRes) {
          console.log("Username does not exist:", username);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.INCORRECT_CRED);
          return;
        }

        const attemptDate = new Date();

        const findResLockedDate = findRes.lockedDate;
        if (
          findResLockedDate &&
          new Date(attemptDate).getTime() - findResLockedDate.getTime() <
            ACCOUNT_LOCK_PERIOD
        ) {
          console.log("Account is locked:", username);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.ACCOUNT_LOCKED);
          return;
        }

        const authenticateUser = (err: any, isPasswordMatch: any) => {
          if (err) {
            console.log(err);
            return;
          }

          if (isPasswordMatch === false) {
            console.log("Incorrect password:", username);

            let authAttempts = findRes.authAttempts ? findRes.authAttempts : [];

            authAttempts.push(attemptDate);
            authAttempts = authAttempts.filter((attempt: any) => {
              return (
                new Date(attemptDate).getTime() - attempt.getTime() <
                ALLOWABLE_TIME_FOR_AUTH_ATTEMPTS
              );
            });

            const lockedDate =
              authAttempts && authAttempts.length >= MAX_AUTH_ATTEMPTS
                ? attemptDate
                : null;

            dbo
              .collection(DATABASE_COLLECTION.USERS_COLLECTION)
              .updateOne(
                { _id: findRes._id },
                { $set: { lockedDate, authAttempts } }
              )
              .then(() => {
                db.close();
                postFailure(
                  postRes,
                  lockedDate
                    ? STATUS_MESSAGE.ACCOUNT_LOCKED
                    : STATUS_MESSAGE.INCORRECT_CRED
                );
              });
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
                console.log("User logged in:", username);
                db.close();
                postSuccess(postRes, {
                  userId: userId.toString(),
                  auth: authToken.key,
                  firstName
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
          db.close();
          postSuccess(postRes, {});
          return;
        }

        const attemptDate = new Date();

        const findResValidationLockedDate = findRes.validationLockedDate;
        if (
          findResValidationLockedDate &&
          new Date(attemptDate).getTime() -
            findResValidationLockedDate.getTime() <
            ACCOUNT_VALIDATE_LOCK_PERIOD
        ) {
          console.log("Account validation is locked");
          db.close();
          postFailure(
            postRes,
            STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          );
          return;
        }

        const confirmationCode = findRes.confirmationCode;

        if (!confirmationCode) {
          console.log("Unable to find pending account for validation");
          db.close();
          postFailure(
            postRes,
            STATUS_MESSAGE.CANNOT_FIND_ACCOUNT_FOR_VALIDATION
          );
          return;
        }

        if (confirmationCode !== obj.validationCode) {
          console.log("Incorrect validation code");

          let validateAttempts = findRes.validateAttempts
            ? findRes.validateAttempts
            : [];

          validateAttempts.push(attemptDate);
          validateAttempts = validateAttempts.filter((attempt: any) => {
            return (
              new Date(attemptDate).getTime() - attempt.getTime() <
              ALLOWABLE_TIME_FOR_VALIDATE_ATTEMPTS
            );
          });

          const validateLockedDate =
            validateAttempts && validateAttempts.length >= MAX_VALIDATE_ATTEMPTS
              ? attemptDate
              : null;

          const dbo = db.db(DATABASE_NAME);
          dbo
            .collection(DATABASE_COLLECTION.USERS_COLLECTION)
            .updateOne(
              { _id: findRes._id },
              { $set: { validateLockedDate, validateAttempts } }
            )
            .then(() => {
              db.close();
              postFailure(
                postRes,
                validateLockedDate
                  ? STATUS_MESSAGE.ACCOUNT_VALIDATION_LOCKED
                  : STATUS_MESSAGE.INCORRECT_VALIDATION_CODE
              );
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
            postSuccess(postRes, {});
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

      const { firstName, email } = findRes;

      const domain = getDomain(email);
      const organization = retrieveOrganizationByDomain(domain);

      const { subscriptionData } = obj;

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
            postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
            throw insertErr;
          }

          const subscriptionId = insertRes.insertedId;

          console.log("Subscription created:", subscriptionId);

          db.close();
          postSuccess(postRes, {
            subscriptionId
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
          postSuccess(postRes, {
            subscriptionId
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
          postSuccess(postRes, {});
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
          postSuccess(postRes, {});
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
      postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
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
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
          throw findErr;
        }

        if (!findRes) {
          console.log("Email address does not exist:", email);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.INCORRECT_CRED);
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
            postFailure(postRes, STATUS_MESSAGE.INCORRECT_CRED);
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
                postSuccess(postRes, {});
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

              dbo
                .collection(DATABASE_COLLECTION.CONVERSATIONS_COLLECTION)
                .updateOne(
                  { _id: new ObjectId(conversationId) },
                  { $push: { messages: messageData } }
                )
                .then(() => {
                  io.emit("message sent", "Hello World !");

                  db.close();
                  postSuccess(postRes, {});
                });
            }
          }
        );
    })
    .catch(err => {
      console.log(err);
    });
};
