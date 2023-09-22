import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getConversationById = (
  conversationId: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    "getconversationbyid",
    [{ conversationId }],
    responseHandler,
    errorHandler,
    authKey
  );
};
