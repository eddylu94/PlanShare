import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const deleteSubscription = (
  subscriptionId: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "deletesubscription",
    { subscriptionId },
    responseHandler,
    errorHandler,
    authKey
  );
};
