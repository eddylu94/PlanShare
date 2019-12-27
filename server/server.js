// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// Imports for Express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Imports for MongoDB
const mongoClient = require("mongodb").MongoClient;

// Import requests
// const {
// } = require('./requests/get-requests.js');
const { signUp } = require("./requests/post-requests");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = process.env.PORT || 36322;
app.set("port", port);

// GET requests

// POST requests
app.post("/signup", (postReq, postRes) =>
  signUp(mongoClient, postReq, postRes)
);

app.listen(app.get("port"), () => {
  console.log(`Server is running on Port ${port}...`);
});
