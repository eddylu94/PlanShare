import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import SettingsCanvas from "./settings-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import {
  STATUS_CODE,
  STATUS_MESSAGE,
  SETTINGS_INPUT_NAME
} from "./../../utils/constants";
import { log, SETTINGS_EMAIL_NOTIFICATIONS } from "./../../utils/utils";

const SettingsProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  // Whether at least one request has been executed for profile
  const [isRetrievedProfileDirty, setIsRetrievedProfileDirty] = useState(false);

  const { history } = props;

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [changePassCurrent, setChangePassCurrent] = useState("");
  const [changePassNew1, setChangePassNew1] = useState("");
  const [changePassNew2, setChangePassNew2] = useState("");

  const [settingEmailNotifications, setSettingEmailNotifications] = useState(
    ""
  );

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  log(_userData);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    switch (name) {
      case SETTINGS_INPUT_NAME.DELETE_ACCOUNT_PASS:
        setPass(value);
        break;
      case SETTINGS_INPUT_NAME.CHANGE_PASS_CURRENT:
        setChangePassCurrent(value);
        break;
      case SETTINGS_INPUT_NAME.CHANGE_PASS_NEW_1:
        setChangePassNew1(value);
        break;
      case SETTINGS_INPUT_NAME.CHANGE_PASS_NEW_2:
        setChangePassNew2(value);
        break;
      default:
        break;
    }
  };

  const handleChangeEmailNotifications = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSetting = (event.target as HTMLInputElement).value;

    setSettingEmailNotifications(newSetting);
    changeSettingEmailNotifications(newSetting);
  };

  const changeSettingEmailNotificationsResponseHandler = (data: any) => {
    log(data);
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.UNKNOWN_ERROR
    ) {
      alert(
        "Unknown error occurred when changing setting. Please try again later."
      );
    } else if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.PASSWORDS_NOT_SAME
    ) {
      alert("Passwords do not match");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      alert("Setting has been udpated");

      setChangePassCurrent("");
      setChangePassNew1("");
      setChangePassNew2("");
    }
  };

  const changeSettingEmailNotificationsErrorHandler = (error: any) => {
    log(error);
  };

  const changeSettingEmailNotifications = (newSetting: string) => {
    const postRequestData = {
      settingEmailNotifications: newSetting
    };

    basePostRequest(
      "changesettingemailnotifications",
      postRequestData,
      changeSettingEmailNotificationsResponseHandler,
      changeSettingEmailNotificationsErrorHandler,
      _userData.user?.auth
    );
  };

  const deleteUserResponseHandler = (data: any) => {
    log(data);
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.INCORRECT_CRED
    ) {
      alert("Incorrect password");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      alert("Account has been successfully deleted");

      _userData.updateUser({
        userId: "",
        auth: "",
        firstName: ""
      });

      localStorage.setItem("userId", "");
      localStorage.setItem("auth", "");
      localStorage.setItem("firstName", "");

      history.push("/signup");
    }
  };

  const deleteUserErrorHandler = (error: any) => {
    log(error);
  };

  const deleteUser = () => {
    const postRequestData = {
      userId: _userData.user?.userId as string,
      email,
      pass
    };

    basePostRequest(
      "deleteuser",
      postRequestData,
      deleteUserResponseHandler,
      deleteUserErrorHandler,
      _userData.user?.auth
    );
  };

  const changePassResponseHandler = (data: any) => {
    log(data);
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.INCORRECT_CRED
    ) {
      alert("Incorrect password");
    } else if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.PASSWORDS_NOT_SAME
    ) {
      alert("Passwords do not match");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      alert("Password has been udpated");

      setChangePassCurrent("");
      setChangePassNew1("");
      setChangePassNew2("");
    }
  };

  const changePassErrorHandler = (error: any) => {
    log(error);
  };

  const changePass = () => {
    const postRequestData = {
      currPass: changePassCurrent,
      newPass1: changePassNew1,
      newPass2: changePassNew2
    };

    basePostRequest(
      "changepass",
      postRequestData,
      changePassResponseHandler,
      changePassErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveEmailResponseHandler = (data: any) => {
    log(data);
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      log("User not validated");
      history.push("/validate");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      setEmail(data?.body?.email);
    }
    setIsRetrievedProfileDirty(true);
  };

  const retrieveEmailErrorHandler = (error: any) => {
    log(error);
  };

  const retrieveEmail = () => {
    baseGetRequest(
      "getemailaddress",
      [],
      retrieveEmailResponseHandler,
      retrieveEmailErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveSettingEmailNotificationsResponseHandler = (data: any) => {
    log(data);
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.UNKNOWN_ERROR
    ) {
      log("Cannot retrieve email notifications setting");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      const settingEmailNotifications = data?.body?.settingEmailNotifications;
      setSettingEmailNotifications(
        settingEmailNotifications ?? SETTINGS_EMAIL_NOTIFICATIONS.WEEKLY
      );
    }
  };

  const retrieveSettingEmailNotificationsErrorHandler = (error: any) => {
    log(error);
  };

  const retrieveSettingEmailNotifications = () => {
    baseGetRequest(
      "getsettingemailnotifications",
      [],
      retrieveSettingEmailNotificationsResponseHandler,
      retrieveSettingEmailNotificationsErrorHandler,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveEmail();
    retrieveSettingEmailNotifications();
    // eslint-disable-next-line
  }, []);

  return isRetrievedProfileDirty ? (
    <SettingsCanvas
      email={email}
      pass={pass}
      changePassCurrent={changePassCurrent}
      changePassNew1={changePassNew1}
      changePassNew2={changePassNew2}
      settingEmailNotifications={settingEmailNotifications}
      handleInputChange={handleInputChange}
      handleSubmit={deleteUser}
      handleSubmitChangePass={changePass}
      handleChangeEmailNotifications={handleChangeEmailNotifications}
    />
  ) : null;
};

const SettingsProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <SettingsProviderWithContext
        userData={userData}
        history={props.history}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(SettingsProvider);
