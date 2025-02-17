export const TITLE = "PlanShare";
export const SLOGAN = "Split costs on subscriptions, group orders, and more!";

// Status codes
export const STATUS_CODE = {
  SUCCESS: 1,
  FAILURE: -1
};

// Status messages
export const STATUS_MESSAGE = {
  UNKNOWN_ERROR: "unknown_error",
  NO_EMAIL_EXISTS: "no_email_exists",
  EMAIL_ALREADY_EXISTS: "email_already_exists",
  USERNAME_ALREADY_EXISTS: "username_already_exists",
  INCORRECT_CRED: "incorrect_cred",
  CANNOT_FIND_ACCOUNT_FOR_VALIDATION: "cannot_find_account_for_validation",
  EMAIL_ALREADY_VALIDATED: "email_already_validated",
  INCORRECT_VALIDATION_CODE: "incorrect_validation_code",
  USER_NOT_VALIDATED: "user_not_validated",
  CANNOT_FIND_SUBSCRIPTIONS: "cannot_find_subscriptions",
  USER_REQUIRES_ACCESS_FOR_SUBSCRIPTION:
    "user_requires_access_for_subscription",
  PROFILE_NOT_FOUND: "profile_not_found",
  CANNOT_FIND_CONVERSATION: "cannot_find_conversation",
  CANNOT_FIND_CONVERSATIONS_LIST: "cannot_find_conversations_list",
  ACCOUNT_LOCKED: "account_locked",
  ACCOUNT_VALIDATION_LOCKED: "account_validation_locked",
  PASSWORDS_NOT_SAME: "passwords_not_match"
};

export const DEVICE_MODE = {
  MOBILE: "MOBILE", // width of less than 768px
  TABLET: "TABLET", // width between 768px and 992px
  DESKTOP: "DESKTOP", // width between 992px and 1200 px
  LARGE_DESKTOP: "LARGE_DESKTOP" // width greater than 1200px
};

export const SETTINGS_INPUT_NAME = {
  DELETE_ACCOUNT_PASS: "DELETE_ACCOUNT_PASS",
  CHANGE_PASS_CURRENT: "CHANGE_PASS_CURRENT",
  CHANGE_PASS_NEW_1: "CHANGE_PASS_NEW_1",
  CHANGE_PASS_NEW_2: "CHANGE_PASS_NEW_2"
};

export const OTHER_BRANDS = [
  "OTHER_MOBILE",
  "OTHER_ONLINE_STREAMING",
  "OTHER_REFERRAL",
  "OTHER_GROUP_PURCHASE",
  "OTHER"
];
