import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getSubscriptionBrands = (
  subscriptionCategory: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest(
    "getsubscriptionbrands",
    [{ subscriptionCategory }],
    responseHandler,
    errorHandler,
    authKey
  );
};
