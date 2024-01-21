import { ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getOrganizations = (
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler
) => {
  baseGetRequest("getorganizations", [], responseHandler, errorHandler);
};
