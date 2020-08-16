import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import SignUpCanvas from "./sign-up-canvas";
import { FORM_INPUT_TYPE } from "./sign-up-utils";
import {
  basePostRequest,
  slackPostRequest,
  ERROR_TYPE,
  SLACK_HOOK
} from "./../../base-requests";
import { log, IResponse, validatePass } from "./../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";
import { IUserContext, UserDataContext } from "../../user-context-provider";

const SignUpProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

  if (_userData.user?.userId) {
    history.push("/search");
  }

  const [firstName, setFirstName] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);

  // const [email, setEmail] = useState("");
  // const [isEmailValid, setIsEmailValid] = useState(false);

  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const [pass1, setPass1] = useState("");
  const [isPass1Valid, setIsPass1Valid] = useState(false);

  const [pass2, setPass2] = useState("");
  const [isPass2Valid, setIsPass2Valid] = useState(false);

  const [termsOfUseAcknowledged, setTermsOfUseAcknowledged] = useState(false);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

  const [
    isTermsOfUseDialogDisplayed,
    setIsTermsOfUseDialogDisplayed
  ] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case FORM_INPUT_TYPE.FIRST_NAME:
        setFirstName(value);
        setIsFirstNameValid(validateFirstName(value));
        break;
      case FORM_INPUT_TYPE.USERNAME:
        setUsername(value);
        setIsUsernameValid(validateUsername(value));
        break;
      case FORM_INPUT_TYPE.PASS1:
        setPass1(value);
        setIsPass1Valid(validatePass(value));
        setIsPass2Valid(validatePass2(value, pass2));
        break;
      case FORM_INPUT_TYPE.PASS2:
        setPass2(value);
        setIsPass2Valid(validatePass2(pass1, value));
        break;
      case FORM_INPUT_TYPE.TERMS_OF_USE_ACKNOWLEDGED:
        setTermsOfUseAcknowledged(value);
        break;
      default:
        break;
    }
  };

  const validateFirstName = (firstName: string) => {
    const re = /^[a-zA-Z ]+$/;
    return re.test(firstName) && !!firstName.trim();
  };

  const validateUsername = (username: string) => {
    const re = /^[a-zA-Z0-9_.-]*$/;
    return re.test(username) && !!username.trim();
  };

  const validatePass2 = (pass1: string, pass2: string) =>
    !!pass2 && pass1 === pass2;

  const isFormDisabled = !(
    isFirstNameValid &&
    isUsernameValid &&
    isPass1Valid &&
    isPass2Valid &&
    termsOfUseAcknowledged
  );

  const handleSubmitResponseHandler = (res: IResponse) => {
    if (res) {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        log("Log in success for:", username);

        const newUserData = res.body;

        const postRequestData = {
          text: JSON.stringify({
            errorType: ERROR_TYPE.CLIENT,
            type: "SIGN_UP",
            userId: newUserData.userId,
            username
          })
        };

        slackPostRequest(SLACK_HOOK.SIGNUPS, postRequestData);

        // Update user data for User Context
        _userData.updateUser(newUserData);

        // Update user data for local storage
        localStorage.setItem("userId", newUserData.userId);
        localStorage.setItem("auth", newUserData.auth);
        localStorage.setItem("firstName", newUserData.firstName);

        history.push("/email");
      } else if (res.statusCode === STATUS_CODE.FAILURE) {
        let errorMessage;
        switch (res.statusMessage) {
          case STATUS_MESSAGE.USERNAME_ALREADY_EXISTS:
            errorMessage = "Username already exists";
            log(errorMessage);
            alert(errorMessage);
            break;
          case STATUS_MESSAGE.EMAIL_ALREADY_EXISTS:
            errorMessage = "Email address already exists";
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
        firstName,
        username: username.toLocaleLowerCase(),
        pass: pass1
      };
      basePostRequest(
        "signup",
        postRequestData,
        handleSubmitResponseHandler,
        handleSubmitErrorHandler
      );
    }

    event.preventDefault();
  };

  const togglePassFocused = (value: boolean) => {
    setIsPassFocused(value);
  };

  const toggleEmailFocused = (value: boolean) => {
    setIsEmailFocused(value);
  };

  return (
    <SignUpCanvas
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      firstName={firstName}
      isFirstNameValid={isFirstNameValid}
      username={username}
      isUsernameValid={isUsernameValid}
      pass1={pass1}
      isPass1Valid={isPass1Valid}
      pass2={pass2}
      isPass2Valid={isPass2Valid}
      termsOfUseAcknowledged={termsOfUseAcknowledged}
      setTermsOfUseAcknowledged={setTermsOfUseAcknowledged}
      isFormDisabled={isFormDisabled}
      isTermsOfUseDialogDisplayed={isTermsOfUseDialogDisplayed}
      setIsTermsOfUseDialogDisplayed={setIsTermsOfUseDialogDisplayed}
      isPassFocused={isPassFocused}
      togglePassFocused={togglePassFocused}
      isEmailFocused={isEmailFocused}
      toggleEmailFocused={toggleEmailFocused}
    />
  );
};

const SignUpProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <SignUpProviderWithContext userData={userData} history={props.history} />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(SignUpProvider);
