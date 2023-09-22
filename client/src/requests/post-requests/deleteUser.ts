import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const deleteUser = (
  userId: string,
  email: string,
  pass: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "deleteuser",
    {
      userId,
      email,
      pass
    },
    responseHandler,
    errorHandler,
    authKey
  );
};
