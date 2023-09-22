import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const createSubscription = (
  isEdit: boolean,
  subscriptionData: any,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    isEdit ? "editsubscription" : "createsubscription",
    { subscriptionData },
    responseHandler,
    errorHandler,
    authKey
  );
};
