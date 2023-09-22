import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const verifyEmail = (
  validationCode: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "verifyemail",
    {
      validationCode
    },
    responseHandler,
    errorHandler,
    authKey
  );
};
