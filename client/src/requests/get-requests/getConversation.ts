import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getConversation = (
  otherUserId: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    "getconversation",
    [{ userId: otherUserId }],
    responseHandler,
    errorHandler,
    authKey
  );
};
