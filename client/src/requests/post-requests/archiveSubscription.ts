import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const archiveSubscription = (
  subscriptionId: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "archivesubscription",
    { subscriptionId },
    responseHandler,
    errorHandler,
    authKey
  );
};
