// Third-party libraries
import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

// API
import {
  getEmailAddress,
  getSettingEmailNotifications
} from "@requests/getRequests";
import {
  changePass,
  changeSettingEmailNotifications,
  deleteUser
} from "@requests/postRequests";

// Utilites
import { UserDataContext } from "user-context-provider";
import { log, validatePass, SETTINGS_EMAIL_NOTIFICATIONS } from "@utils/utils";
import { InputChangeEvent } from "@utils/interfaces";
import {
  STATUS_CODE,
  STATUS_MESSAGE,
  SETTINGS_INPUT_NAME
} from "@utils/constants";

const SettingsProvider = (props: { history: History }) => {
  const _userData = useContext(UserDataContext);

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

  const handleInputChange = (event: InputChangeEvent) => {
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

  const handleChangeEmailNotifications = (event: InputChangeEvent) => {
    const newSetting = (event.target as HTMLInputElement).value;

    setSettingEmailNotifications(newSetting);
    changeSettingEmailNotificationsHandler(newSetting);
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

  const changeSettingEmailNotificationsHandler = (newSetting: string) => {
    changeSettingEmailNotifications(
      newSetting,
      changeSettingEmailNotificationsResponseHandler,
      log,
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
        username: ""
      });

      localStorage.setItem("userId", "");
      localStorage.setItem("auth", "");
      localStorage.setItem("username", "");

      history.push("/signup");
    }
  };

  const deleteUserHandler = () => {
    deleteUser(
      _userData.user?.userId as string,
      email,
      pass,
      deleteUserResponseHandler,
      log,
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

  const changePassHandler = () => {
    changePass(
      changePassCurrent,
      changePassNew1,
      changePassNew2,
      changePassResponseHandler,
      log,
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

  const retrieveEmail = () => {
    getEmailAddress(retrieveEmailResponseHandler, log, _userData.user?.auth);
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

  const retrieveSettingEmailNotifications = () => {
    getSettingEmailNotifications(
      retrieveSettingEmailNotificationsResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveEmail();
    retrieveSettingEmailNotifications();
    // eslint-disable-next-line
  }, []);

  const isSubmitChangePassDisabled = !(
    !!changePassCurrent &&
    validatePass(changePassNew1) &&
    changePassNew1 === changePassNew2
  );

  const emailNotificationsStyles = {
    padding: 0,
    margin: "5px 5px 5px 20px",
    color: "#6C5DBD"
  };

  return isRetrievedProfileDirty ? (
    <div className="page-container" style={{ alignItems: "center" }}>
      <div className="page-wrapper">
        <div className="settings-container">
          <h3 className="settings-header">Email notifications</h3>
          <div>
            <div className="settings-delete-description">
              How often would you like to receive notifications for new messages
              that you have received for your listings?
            </div>

            <RadioGroup
              aria-label="Sort results by"
              name="sort-by"
              value={settingEmailNotifications}
              onChange={handleChangeEmailNotifications}
            >
              <FormControlLabel
                value={SETTINGS_EMAIL_NOTIFICATIONS.DAILY}
                control={<Radio style={emailNotificationsStyles} />}
                label={
                  <Typography style={{ fontSize: 15 }}>
                    {"At most once a day"}
                  </Typography>
                }
              />

              <FormControlLabel
                value={SETTINGS_EMAIL_NOTIFICATIONS.WEEKLY}
                control={<Radio style={emailNotificationsStyles} />}
                label={
                  <Typography style={{ fontSize: 15 }}>
                    {"At most once a week"}
                  </Typography>
                }
              />

              <FormControlLabel
                value={SETTINGS_EMAIL_NOTIFICATIONS.MONTHLY}
                control={<Radio style={emailNotificationsStyles} />}
                label={
                  <Typography style={{ fontSize: 15 }}>
                    {"At most once a month"}
                  </Typography>
                }
              />

              <FormControlLabel
                value={SETTINGS_EMAIL_NOTIFICATIONS.NEVER}
                control={<Radio style={emailNotificationsStyles} />}
                label={
                  <Typography style={{ fontSize: 15 }}>{"Never"}</Typography>
                }
              />
            </RadioGroup>
          </div>
        </div>

        <div className="settings-container" style={{ marginTop: 20 }}>
          <h3 className="settings-header">Change password</h3>
          <div>
            <div className="settings-delete-description">
              Please enter your current password:
            </div>
            <input
              className="settings-delete-text-input"
              name={SETTINGS_INPUT_NAME.CHANGE_PASS_CURRENT}
              type="password"
              placeholder="Current password"
              value={changePassCurrent}
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <div className="settings-delete-description">
              Please enter your new password (8+ chracters with letters and
              numbers):
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                className="settings-delete-text-input"
                name={SETTINGS_INPUT_NAME.CHANGE_PASS_NEW_1}
                type="password"
                placeholder="New password"
                value={changePassNew1}
                onChange={handleInputChange}
              />
              <input
                className="settings-delete-text-input"
                name={SETTINGS_INPUT_NAME.CHANGE_PASS_NEW_2}
                type="password"
                placeholder="Confirm new password"
                value={changePassNew2}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="settings-delete-button"
              onClick={changePassHandler}
              style={{ marginTop: 20 }}
              disabled={isSubmitChangePassDisabled}
            >
              Change password
            </button>
          </div>
        </div>

        <div className="settings-container" style={{ marginTop: 20 }}>
          <h3 className="settings-header">Delete account</h3>
          <div>
            <div className="settings-delete-description">
              This action cannot be undone. This will permanently delete the{" "}
              <span className="b">{email}</span> account, and remove all
              associated subscription listings. Please type your password to
              confirm.
            </div>
            <input
              className="settings-delete-text-input"
              name={SETTINGS_INPUT_NAME.DELETE_ACCOUNT_PASS}
              type="password"
              placeholder="Password"
              value={pass}
              onChange={handleInputChange}
            />
            <button
              className="settings-delete-button"
              onClick={deleteUserHandler}
              disabled={!pass}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default withRouter(SettingsProvider);
