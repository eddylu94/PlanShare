// Imports for Express
import express from "express";
const app = express();
import bodyParser from "body-parser";

// Imports for MongoDB
import mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;

// Import requests
import {
  getValidationEmail,
  getOrganizations,
  getSubscriptionCategories,
  getSubscriptionBrands,
  getSubscriptions,
  getProfile,
  getSubscription,
  getSubscriptionsByAuthor,
  getEmailAddress,
  getConversation,
  getConversationById
} from "./requests/get-requests";
import {
  signUp,
  login,
  verifyEmail,
  createSubscription,
  deleteUser,
  sendMessage
} from "./requests/post-requests";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const port = process.env.PORT || 36322;
app.set("port", port);

const getRequestBuilder = (path: string, request: any) => {
  return app.get(path, (postReq, postRes) =>
    request(mongoClient, postReq, postRes)
  );
};

const postRequestBuilder = (path: string, request: any) => {
  return app.post(path, (postReq, postRes) =>
    request(mongoClient, postReq, postRes)
  );
};

// GET requests
getRequestBuilder("/getvalidationemail", getValidationEmail);
getRequestBuilder("/getorganizations", getOrganizations);
getRequestBuilder("/getsubscriptioncategories", getSubscriptionCategories);
getRequestBuilder("/getsubscriptionbrands", getSubscriptionBrands);
getRequestBuilder("/getsubscriptions", getSubscriptions);
getRequestBuilder("/getprofile", getProfile);
getRequestBuilder("/getsubscription", getSubscription);
getRequestBuilder("/getsubscriptionsbyauthor", getSubscriptionsByAuthor);
getRequestBuilder("/getemailaddress", getEmailAddress);
getRequestBuilder("/getconversation", getConversation);
getRequestBuilder("/getconversationbyid", getConversationById);

// POST requests
postRequestBuilder("/signup", signUp);
postRequestBuilder("/login", login);
postRequestBuilder("/verifyemail", verifyEmail);
postRequestBuilder("/createsubscription", createSubscription);
postRequestBuilder("/deleteuser", deleteUser);
postRequestBuilder("/sendmessage", sendMessage);

app.listen(app.get("port"), () => {
  console.log(`Server is running on Port ${port}...`);
});
