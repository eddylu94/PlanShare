import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const sendMessage = (
  conversationId: string,
  message: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "sendmessage",
    {
      conversationId,
      message
    },
    responseHandler,
    errorHandler,
    authKey
  );
};
