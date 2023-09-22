import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getOrganization = (
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  baseGetRequest("getorganization", [], responseHandler, errorHandler, authKey);
};
