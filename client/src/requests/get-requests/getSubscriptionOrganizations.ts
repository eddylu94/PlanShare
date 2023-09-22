import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getSubscriptionOrganizations = (
  isAuthenticated: boolean,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    isAuthenticated
      ? "getsubscriptionorganizations"
      : "getsubscriptionorganizationsasguest",
    [],
    responseHandler,
    errorHandler,
    authKey
  );
};
