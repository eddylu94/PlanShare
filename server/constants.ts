export const TITLE = "PlanShare";
export const SLOGAN = "Find colleagues to split costs on group plans";

// Database collections
export const DATABASE_COLLECTION = {
  USERS_COLLECTION: "Users",
  SUBSCRIPTIONS_COLLECTION: "Subscriptions",
  CONVERSATIONS_COLLECTION: "Conversations"
};

// Status codes
export const STATUS_CODE = {
  SUCCESS: 1,
  FAILURE: -1
};

// Status messages
export const STATUS_MESSAGE = {
  UNKNOWN_ERROR: "unknown_error",
  EMAIL_ALREADY_EXISTS: "email_already_exists",
  INCORRECT_CRED: "incorrect_cred",
  CANNOT_FIND_ACCOUNT_FOR_VALIDATION: "cannot_find_account_for_validation",
  EMAIL_ALREADY_VALIDATED: "email_already_validated",
  INCORRECT_VALIDATION_CODE: "incorrect_validation_code",
  USER_NOT_VALIDATED: "user_not_validated",
  CANNOT_FIND_SUBSCRIPTIONS: "cannot_find_subscriptions",
  USER_NOT_MEMBER_OF_ORGANIZATION: "user_not_member_of_organization",
  PROFILE_NOT_FOUND: "profile_not_found",
  CANNOT_FIND_CONVERSATION: "cannot_find_conversation"
};

// MongoDB constants
export const MONGO_URL = "mongodb://localhost:27017/";
export const DATABASE_NAME = "project3632db";

export const MONGO_PREREQUISITIES = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Client-Server constants

export const SORT_BY = {
  DATE_ASC: "date_asc",
  DATE_DES: "date_des",
  SUBSCRIPTION_BRAND_ASC: "subscription_brand_asc",
  SUBSCRIPTION_BRAND_DES: "subscription_brand_des"
};
