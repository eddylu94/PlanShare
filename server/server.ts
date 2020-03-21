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
  getProfile
} from "./requests/get-requests";
import {
  signUp,
  login,
  verifyEmail,
  createSubscription
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

const requestBuilder = (path: string, request: any) => {
  return app.get(path, (postReq, postRes) =>
    request(mongoClient, postReq, postRes)
  );
};

// GET requests
requestBuilder("/getvalidationemail", getValidationEmail);
requestBuilder("/getorganizations", getOrganizations);
requestBuilder("/getsubscriptioncategories", getSubscriptionCategories);
requestBuilder("/getsubscriptionbrands", getSubscriptionBrands);
requestBuilder("/getsubscriptions", getSubscriptions);
requestBuilder("/getprofile", getProfile);

// POST requests
requestBuilder("/signup", signUp);
requestBuilder("/login", login);
requestBuilder("/verifyemail", verifyEmail);
requestBuilder("/createsubscription", createSubscription);

app.listen(app.get("port"), () => {
  console.log(`Server is running on Port ${port}...`);
});
