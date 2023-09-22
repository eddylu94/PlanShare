import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getSubscriptionsByAuthor = (
  query: Array<any>,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    "getsubscriptionsbyauthor",
    query,
    responseHandler,
    errorHandler,
    authKey
  );
};
