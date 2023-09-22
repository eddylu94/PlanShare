import { AuthKey, ErrorHandler, ResponseHandler } from "@utils/interfaces";
import { basePostRequest } from "base-requests";

export const changeSettingEmailNotifications = (
  settingEmailNotifications: string,
  responseHandler: ResponseHandler,
  errorHandler: ErrorHandler,
  authKey: AuthKey
) => {
  basePostRequest(
    "changesettingemailnotifications",
    { settingEmailNotifications },
    responseHandler,
    errorHandler,
    authKey
  );
};
