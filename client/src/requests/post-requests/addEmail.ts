import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const addEmail = (
  email: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "addemail",
    {
      email
    },
    responseHandler,
    errorHandler,
    authKey
  );
};
