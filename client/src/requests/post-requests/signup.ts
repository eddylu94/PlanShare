import { ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const signup = (
  firstName: string,
  username: string,
  pass: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler
) => {
  basePostRequest(
    "signup",
    {
      firstName,
      username,
      pass
    },
    responseHandler,
    errorHandler
  );
};
