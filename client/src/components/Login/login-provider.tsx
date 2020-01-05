import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import LoginCanvas from "./login-canvas";
import { FORM_INPUT_TYPE } from "./login-utils";
import { basePostRequest } from "./../../base-requests";
import { IResponse } from "./../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";
import { IUserContext, UserDataContext } from "../../user-context-provider";

const LoginProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [pass, setPass] = useState("");
  const [isPassValid, setIsPassValid] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case FORM_INPUT_TYPE.EMAIL:
        setEmail(value);
        setIsEmailValid(validateEmail(value));
        break;
      case FORM_INPUT_TYPE.PASS:
        setPass(value);
        setIsPassValid(validatePass(value));
        break;
      default:
        break;
    }
  };

  const validateEmail = (email: string) => !!email;

  const validatePass = (pass: string) => !!pass;

  const isFormDisabled = !(isEmailValid && isPassValid);

  const handleSubmitResponseHandler = (res: IResponse) => {
    if (res) {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        // console.log("Log in success for:", email);

        const newUserData = res.body;

        // Update user data for User Context
        _userData.updateUser(newUserData);

        // Update user data for local storage
        localStorage.setItem("userId", newUserData.userId);
        localStorage.setItem("auth", newUserData.auth);

        history.push("/");
      } else if (res.statusCode === STATUS_CODE.FAILURE) {
        let errorMessage;
        switch (res.statusMessage) {
          case STATUS_MESSAGE.INCORRECT_CRED:
            errorMessage = "Incorrect email and/or password";
            console.log(errorMessage);
            alert(errorMessage);
            break;
          case STATUS_MESSAGE.UNKNOWN_ERROR:
          default:
            errorMessage = "An unknown error has occured";
            console.log(errorMessage);
            alert(errorMessage);
            break;
        }
      }
    } else {
      console.log("Error receiving response");
    }
  };

  const handleSubmitErrorHandler = (err: any) => {
    console.log(err);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!isFormDisabled) {
      const postRequestData = {
        email,
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
      email={email}
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
