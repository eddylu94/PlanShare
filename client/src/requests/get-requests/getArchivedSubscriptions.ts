import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getArchivedSubscriptions = (
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    "getarchivedsubscriptions",
    [],
    responseHandler,
    errorHandler,
    authKey
  );
};
