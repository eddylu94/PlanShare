import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const resendConfirmationCode = (
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "resendconfirmationcode",
    [],
    responseHandler,
    errorHandler,
    authKey
  );
};
