export const TITLE = "PlanShare";
export const SLOGAN = "Find colleagues to split costs on group plans";

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
  CANNOT_FIND_CONVERSATION: "cannot_find_conversation",
  CANNOT_FIND_CONVERSATIONS_LIST: "cannot_find_conversations_list"
};

export const DEVICE_MODE = {
  MOBILE: "MOBILE", // width of less than 768px
  TABLET: "TABLET", // width between 768px and 992px
  DESKTOP: "DESKTOP" // width greater than 992px
};
