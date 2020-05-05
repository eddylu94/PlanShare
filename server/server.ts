// Imports for Express
import express from "express";
const app = express();
import bodyParser from "body-parser";

// Imports for MongoDB
import mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;

const server = require("http").Server(app);

import socketIo from "socket.io";
const io = socketIo(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Import requests
import {
  getValidationEmail,
  getSubscriptionCategories,
  getSubscriptionBrands,
  getSubscriptions,
  getSubscriptionsAsGuest,
  getProfile,
  getSubscription,
  getSubscriptionsByAuthor,
  getArchivedSubscriptions,
  getEmailAddress,
  getConversation,
  getConversationById,
  getConversationsList
} from "./requests/get-requests";
import {
  signUp,
  login,
  verifyEmail,
  createSubscription,
  editSubscription,
  archiveSubscription,
  deleteSubscription,
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

server.listen(port, () => {
  console.log(`Server is running on Port ${port}...`);
});

const getRequestBuilder = (path: string, request: any) => {
  return app.get(path, (postReq, postRes) =>
    request(mongoClient, postReq, postRes)
  );
};

const postRequestBuilder = (
  path: string,
  request: any,
  io?: socketIo.Server
) => {
  return app.post(path, (postReq, postRes) =>
    request(mongoClient, postReq, postRes, io)
  );
};

io.on("connection", (socket: any) => {
  console.log("a user connected");

  const room = socket.request._query.conversationId;
  console.log("Room:", room);

  socket.join(room);

  socket.emit("room joined", room);

  socket.on("send message", (query: any) => {
    console.log("send message");
    console.log(query);
    io.to(room).emit("message received", room);
  });
});

// GET requests
getRequestBuilder("/getvalidationemail", getValidationEmail);
getRequestBuilder("/getsubscriptioncategories", getSubscriptionCategories);
getRequestBuilder("/getsubscriptionbrands", getSubscriptionBrands);
getRequestBuilder("/getsubscriptions", getSubscriptions);
getRequestBuilder("/getsubscriptionsasguest", getSubscriptionsAsGuest);
getRequestBuilder("/getprofile", getProfile);
getRequestBuilder("/getsubscription", getSubscription);
getRequestBuilder("/getsubscriptionsbyauthor", getSubscriptionsByAuthor);
getRequestBuilder("/getarchivedsubscriptions", getArchivedSubscriptions);
getRequestBuilder("/getemailaddress", getEmailAddress);
getRequestBuilder("/getconversation", getConversation);
getRequestBuilder("/getconversationbyid", getConversationById);
getRequestBuilder("/getconversationslist", getConversationsList);

// POST requests
postRequestBuilder("/signup", signUp);
postRequestBuilder("/login", login);
postRequestBuilder("/verifyemail", verifyEmail);
postRequestBuilder("/createsubscription", createSubscription);
postRequestBuilder("/editsubscription", editSubscription);
postRequestBuilder("/archivesubscription", archiveSubscription);
postRequestBuilder("/deletesubscription", deleteSubscription);
postRequestBuilder("/deleteuser", deleteUser);
postRequestBuilder("/sendmessage", sendMessage, io);
