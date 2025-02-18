import { ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const signup = (
  username: string,
  pass: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler
) => {
  basePostRequest(
    "signup",
    {
      username,
      pass
    },
    responseHandler,
    errorHandler
  );
};
