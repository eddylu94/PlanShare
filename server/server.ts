import "./loadEnv";

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

app.get("/", (req: express.Request, res: express.Response) => {
  res.sendFile(__dirname + "/index.html");
});

// Import requests
import GetRequests from "./requests/get-requests";
import PostRequests from "./requests/post-requests";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  }
);

const port = process.env.PORT || 36322;
app.set("port", port);

server.listen(port, () => {
  console.log(`Server is running on Port ${port}...`);
});
server.on("error", (err: any) => {
  console.log("Server listen error", err && err.message);
});

const getRequestBuilder = (path: string, request: any) => {
  return app.get(path, (postReq: express.Request, postRes: express.Response) =>
    request(mongoClient, postReq, postRes)
  );
};

const postRequestBuilder = (
  path: string,
  request: any,
  io?: socketIo.Server
) => {
  return app.post(path, (postReq: express.Request, postRes: express.Response) =>
    request(mongoClient, postReq, postRes, io)
  );
};

io.on("connection", (socket: any) => {
  // console.log("a user connected");

  const room = socket.request._query.conversationId;
  // console.log("Room:", room);

  socket.join(room);

  socket.emit("room joined", room);

  socket.on("send message", (query: any) => {
    console.log("send message");
    console.log(query);
    io.to(room).emit("message received", room);
  });
});

// GET requests
getRequestBuilder("/marco", GetRequests.poll);
getRequestBuilder("/getvalidationemail", GetRequests.getValidationEmail);
getRequestBuilder("/getneighborhoods", GetRequests.getNeighborhoods);
getRequestBuilder(
  "/getsubscriptioncategories",
  GetRequests.getSubscriptionCategories
);
getRequestBuilder("/getsubscriptionbrands", GetRequests.getSubscriptionBrands);
getRequestBuilder("/getsubscriptions", GetRequests.getSubscriptions);
getRequestBuilder(
  "/getsubscriptionsasguest",
  GetRequests.getSubscriptionsAsGuest
);
getRequestBuilder("/getprofile", GetRequests.getProfile);
getRequestBuilder("/getsubscription", GetRequests.getSubscription);
getRequestBuilder(
  "/getsubscriptionasguest",
  GetRequests.getSubscriptionAsGuest
);
getRequestBuilder(
  "/getsubscriptionsbyauthor",
  GetRequests.getSubscriptionsByAuthor
);
getRequestBuilder(
  "/getarchivedsubscriptions",
  GetRequests.getArchivedSubscriptions
);
getRequestBuilder("/getemailaddress", GetRequests.getEmailAddress);
getRequestBuilder(
  "/getsettingemailnotifications",
  GetRequests.getSettingEmailNotifications
);
getRequestBuilder("/getconversation", GetRequests.getConversation);
getRequestBuilder("/getconversationbyid", GetRequests.getConversationById);
getRequestBuilder("/getconversationslist", GetRequests.getConversationsList);
getRequestBuilder("/getunreadmessages", GetRequests.getUnreadMessagesCount);
getRequestBuilder("/api/internal/insights", GetRequests.getInsights);

// POST requests
postRequestBuilder("/signup", PostRequests.signUp);
postRequestBuilder("/login", PostRequests.login);
postRequestBuilder("/changepass", PostRequests.changePass);
postRequestBuilder("/feedback", PostRequests.submitFeedback);
postRequestBuilder("/verifyemail", PostRequests.verifyEmail);
postRequestBuilder(
  "/resendconfirmationcode",
  PostRequests.resendConfirmationCode
);
postRequestBuilder("/createsubscription", PostRequests.createSubscription);
postRequestBuilder("/editsubscription", PostRequests.editSubscription);
postRequestBuilder("/archivesubscription", PostRequests.archiveSubscription);
postRequestBuilder("/deletesubscription", PostRequests.deleteSubscription);
postRequestBuilder("/deleteuser", PostRequests.deleteUser);
postRequestBuilder("/sendmessage", PostRequests.sendMessage, io);
postRequestBuilder(
  "/changesettingemailnotifications",
  PostRequests.changeSettingEmailNotifications
);
