const { EMAIL_SERVICE_EMAIL, transporter } = require("./../email-service.js");
const {
  generateConfirmationCode,
  generateAuthToken
} = require("./../utils.js");
const {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES
} = require("./../constants.js");

const signUp = (mongoClient, postReq, postRes) => {
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
    const email = obj.email;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .find({ email })
      .toArray((findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
          throw findErr;
        }

        if (findRes.length != 0) {
          console.log("Email address already exists:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.EMAIL_ALREADY_EXISTS
          });
          return;
        }

        const authToken = generateAuthToken();
        Object.assign(obj, {
          authTokens: [authToken],
          validated: false
        });

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
                auth: authToken.key
              }
            });

            const mailSubject = "Welcome to Project 3632";
            const mailMessage = `Thank you for registering for Project 3632!<br /><br />Your confirmation code is:<br /><span style="font-weight: bold;">${generateConfirmationCode()}</span>`;

            const mailOptions = {
              from: EMAIL_SERVICE_EMAIL,
              to: email,
              subject: mailSubject,
              html: mailMessage
            };

            transporter.sendMail(mailOptions, function(sendErr, info) {
              if (sendErr) {
                console.log("Error sending email");
                throw sendErr;
              } else {
                console.log("Email sent: " + info.response);
              }
            });
          });
      });
  });
};

const login = (mongoClient, postReq, postRes) => {
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
    const { email, pass } = obj;
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .find({ email })
      .toArray((findErr, findRes) => {
        if (findErr) {
          console.log("Error finding record");
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.UNKNOWN_ERROR
          });
          throw findErr;
        }

        if (findRes.length === 0) {
          console.log("Email address does not exist:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.EMAIL_DOES_NOT_EXIST
          });
          return;
        }

        const user = findRes[0];

        if (user.pass !== pass) {
          console.log("Incorrect password:", email);
          db.close();
          postRes.json({
            statusCode: STATUS_CODE.FAILURE,
            statusMessage: STATUS_MESSAGE.INCORRECT_PASS
          });
          return;
        }

        const userId = user._id;

        const authToken = generateAuthToken();

        dbo
          .collection(DATABASE_COLLECTION.USERS_COLLECTION)
          .updateOne({ _id: user._id }, { $push: { authTokens: authToken } })
          .then(() => {
            console.log("User logged in:", email);
            db.close();
            postRes.json({
              statusCode: STATUS_CODE.SUCCESS,
              body: {
                userId: userId.toString(),
                auth: authToken.key
              }
            });
          });
      });
  });
};

module.exports = {
  signUp,
  login
};
