import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const submitFeedback = (
  message: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "feedback",
    {
      message
    },
    responseHandler,
    errorHandler,
    authKey
  );
};
