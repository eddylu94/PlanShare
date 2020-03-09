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
  getGroups,
  getSubscriptionTypes,
  getSubscriptionGroup,
  getSubscriptions
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

// GET requests
app.get("/getvalidationemail", (postReq, postRes) =>
  getValidationEmail(mongoClient, postReq, postRes)
);
app.get("/getGroups", (postReq, postRes) =>
  getGroups(mongoClient, postReq, postRes)
);
app.get("/getSubscriptionTypes", (postReq, postRes) =>
  getSubscriptionTypes(mongoClient, postReq, postRes)
);
app.get("/getSubscriptionGroup", (postReq, postRes) =>
  getSubscriptionGroup(mongoClient, postReq, postRes)
);
app.get("/getSubscriptions", (postReq, postRes) =>
  getSubscriptions(mongoClient, postReq, postRes)
);

// POST requests
app.post("/signup", (postReq, postRes) =>
  signUp(mongoClient, postReq, postRes)
);
app.post("/login", (postReq, postRes) => login(mongoClient, postReq, postRes));
app.post("/verifyemail", (postReq, postRes) =>
  verifyEmail(mongoClient, postReq, postRes)
);
app.post("/createsubscription", (postReq, postRes) =>
  createSubscription(mongoClient, postReq, postRes)
);

app.listen(app.get("port"), () => {
  console.log(`Server is running on Port ${port}...`);
});
