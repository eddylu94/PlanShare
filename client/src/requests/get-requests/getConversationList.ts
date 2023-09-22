import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getConversationList = (
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    "getconversationslist",
    [],
    responseHandler,
    errorHandler,
    authKey
  );
};
