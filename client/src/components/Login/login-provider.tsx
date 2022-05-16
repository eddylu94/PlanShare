import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import LoginCanvas from "./login-canvas";
import { FORM_INPUT_TYPE } from "./login-utils";
import { basePostRequest } from "./../../base-requests";
import { log, IResponse } from "./../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";
import { IUserContext, UserDataContext } from "../../user-context-provider";

const LoginProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

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

  const handleSubmitErrorHandler = (err: any) => {
    log(err);
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
        handleSubmitErrorHandler
      );
    }

    event.preventDefault();
  };

  return (
    <LoginCanvas
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      username={username}
      pass={pass}
      isFormDisabled={isFormDisabled}
    />
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
