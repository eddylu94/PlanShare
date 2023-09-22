import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const changePass = (
  currPass: string,
  newPass1: string,
  newPass2: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "changepass",
    {
      currPass,
      newPass1,
      newPass2
    },
    responseHandler,
    errorHandler,
    authKey
  );
};
