import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { FORM_INPUT_TYPE } from "./login-utils";
import { log, IResponse, useDeviceMode } from "@utils/utils";
import {
  DEVICE_MODE,
  STATUS_CODE,
  STATUS_MESSAGE,
  TITLE
} from "@utils/constants";
import { UserDataContext } from "user-context-provider";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import { login } from "@requests/postRequests";

const LoginProvider = (props: { history: History }) => {
  const { history } = props;

  const _userData = useContext(UserDataContext);

  if (_userData.user?.userId) {
    history.push("/search");
  }

  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const [pass, setPass] = useState("");
  const [isPassValid, setIsPassValid] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case FORM_INPUT_TYPE.USERNAME:
        setUsername(value);
        setIsUsernameValid(validateUsername(value));
        break;
      case FORM_INPUT_TYPE.PASS:
        setPass(value);
        setIsPassValid(validatePass(value));
        break;
      default:
        break;
    }
  };

  const validateUsername = (username: string) => !!username;
  const validatePass = (pass: string) => !!pass;

  const isFormDisabled = !(isUsernameValid && isPassValid);

  const handleSubmitResponseHandler = (res: IResponse) => {
    if (res) {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        // log("Log in success for:", user);

        const newUserData = res.body;

        // Update user data for User Context
        _userData.updateUser(newUserData);

        // Update user data for local storage
        localStorage.setItem("userId", newUserData.userId);
        localStorage.setItem("auth", newUserData.auth);
        localStorage.setItem("username", newUserData.username);

        history.push("/search");
      } else if (res.statusCode === STATUS_CODE.FAILURE) {
        let errorMessage;
        switch (res.statusMessage) {
          case STATUS_MESSAGE.INCORRECT_CRED:
            errorMessage = "Incorrect username and/or password";
            log(errorMessage);
            alert(errorMessage);
            break;
          case STATUS_MESSAGE.ACCOUNT_LOCKED:
            errorMessage =
              "We're sorry, due to the number of recent login attempts, this account has been temporarily locked";
            log(errorMessage);
            alert(errorMessage);
            break;
          case STATUS_MESSAGE.UNKNOWN_ERROR:
          default:
            errorMessage = "An unknown error has occured";
            log(errorMessage);
            alert(errorMessage);
            break;
        }
      }
    } else {
      log("Error receiving response");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!isFormDisabled) {
      login(
        username.toLocaleLowerCase(),
        pass,
        handleSubmitResponseHandler,
        log
      );
    }

    event.preventDefault();
  };

  const deviceMode = useDeviceMode();

  return (
    <div
      className="page-container"
      style={{
        backgroundColor: "#f3f1ff",
        ...(deviceMode === DEVICE_MODE.MOBILE && { padding: 0 })
      }}
    >
      <div className="login-container">
        <form className="login-form-container" onSubmit={handleSubmit}>
          <div className="login-intro">
            <div className="intro-logo-and-title" style={{ marginBottom: 20 }}>
              <img
                alt={TITLE}
                className="intro-icon"
                src={"./icon_transparent.png"}
              />
              <span className="intro-title">{TITLE}</span>
            </div>
            <div
              className="subscription-icons-container"
              style={{ marginBottom: 20 }}
            >
              <img
                alt="Subscriptions"
                className="subscription-icons"
                src={"./subscription_icons.png"}
              />
            </div>
            <div className="intro-welcome-header">Welcome back!</div>
          </div>
          <div className="login-form-wrapper">
            <h2 className="signup-form-header">Log In</h2>
            <TextField
              label="Username"
              name={FORM_INPUT_TYPE.USERNAME}
              value={username}
              onChange={handleInputChange}
              margin="dense"
              autoComplete="off"
            />
            <TextField
              label="Password"
              name={FORM_INPUT_TYPE.PASS}
              value={pass}
              onChange={handleInputChange}
              type="password"
              margin="dense"
              autoComplete="off"
            />
            <input
              className="form-submit-button"
              type="submit"
              value="Submit"
              disabled={isFormDisabled}
            />
            <Link className="signup-toggle" to="/signup">
              Need to create an account? Sign up here
            </Link>
            <Link className="signup-toggle" to="/">
              Browse as guest
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withRouter(LoginProvider);
