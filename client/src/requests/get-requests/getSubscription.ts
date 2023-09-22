import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getSubscription = (
  subscriptionId: string,
  isAuthenticated: boolean,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    isAuthenticated ? "getsubscription" : "getsubscriptionasguest",
    [{ subscriptionId }],
    responseHandler,
    errorHandler,
    authKey
  );
};
