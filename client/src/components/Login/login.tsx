import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { FORM_INPUT_TYPE } from "./login-utils";
import { basePostRequest } from "../../base-requests";
import { log, IResponse } from "../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE, TITLE } from "../../utils/constants";
import { IUserContext, UserDataContext } from "../../user-context-provider";
import { Link } from "react-router-dom";

const LoginProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const { history, userData: _userData } = props;

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
        localStorage.setItem("firstName", newUserData.firstName);

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
      const postRequestData = {
        username: username.toLocaleLowerCase(),
        pass
      };
      basePostRequest(
        "login",
        postRequestData,
        handleSubmitResponseHandler,
        log
      );
    }

    event.preventDefault();
  };

  const renderTextInputWithValidation = (
    name: string,
    type: string,
    placeholder: string,
    value: string
  ) => (
    <div
      key={"form-input-with-validation-" + name}
      className="form-text-input-with-validation"
    >
      <input
        key={"form-input-" + name}
        className={"form-text-input"}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );

  return (
    <div className="page-container" style={{ backgroundColor: "#6C5DBD" }}>
      <div className="login-container">
        <form className="login-form-container" onSubmit={handleSubmit}>
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
          {renderTextInputWithValidation(
            FORM_INPUT_TYPE.USERNAME,
            "username",
            "Username",
            username
          )}
          {renderTextInputWithValidation(
            FORM_INPUT_TYPE.PASS,
            "password",
            "Password",
            pass
          )}
          <input
            className="form-submit-button"
            type="submit"
            value="Submit"
            disabled={isFormDisabled}
          />
          <Link className="signup-toggle" to="/signup">
            Need to create an account? Sign up here
          </Link>
        </form>
      </div>
    </div>
  );
};

const LoginProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <LoginProviderWithContext userData={userData} history={props.history} />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(LoginProvider);
