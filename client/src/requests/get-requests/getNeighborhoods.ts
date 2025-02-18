import { ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { baseGetRequest } from "base-requests";

export const getNeighborhoods = (
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler
) => {
  baseGetRequest("getneighborhoods", [], responseHandler, errorHandler);
};
