import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getSubscriptions = (
  isAuthenticated: boolean,
  query: Array<any>,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    isAuthenticated ? "getsubscriptions" : "getsubscriptionsasguest",
    query,
    responseHandler,
    errorHandler,
    authKey
  );
};
