// Database collections
DATABASE_COLLECTION = {
  USERS_COLLECTION: "Users"
};

// Status codes
STATUS_CODE = {
  SUCCESS: 1,
  FAILURE: -1
};

// Status messages
STATUS_MESSAGE = {
  UNKNOWN_ERROR: "unknown_error",
  EMAIL_ALREADY_EXISTS: "email_already_exists"
};

// MongoDB constants
const MONGO_URL = "mongodb://localhost:27017/";
const DATABASE_NAME = "project3632db";

const MONGO_PREREQUISITIES = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

module.exports = {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_CODE,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES
};
