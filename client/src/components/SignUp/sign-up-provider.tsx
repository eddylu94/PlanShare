import React, { useState } from "react";
import SignUpCanvas from "./sign-up-canvas";
import { FORM_INPUT_TYPE } from "./sign-up-utils";
import { basePostRequest } from "./../../base-requests";
import { IResponse } from "./../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";
import { IUserContext, UserDataContext } from "../../user-context-provider";

const SignUpProviderWithContext = (props: { userData: IUserContext }) => {
  const _userData = props.userData;

  const [firstName, setFirstName] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [pass1, setPass1] = useState("");
  const [isPass1Valid, setIsPass1Valid] = useState(false);

  const [pass2, setPass2] = useState("");
  const [isPass2Valid, setIsPass2Valid] = useState(false);

  const [termsOfUseAcknowledged, setTermsOfUseAcknowledged] = useState(false);

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
      case FORM_INPUT_TYPE.EMAIL:
        setEmail(value);
        setIsEmailValid(validateEmail(value));
        break;
      case FORM_INPUT_TYPE.PASS1:
        setPass1(value);
        setIsPass1Valid(validatePass1(value));
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

  const validateEmail = (email: string) => {
    // eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  };

  const validatePass1 = (pass1: string) => {
    // Minimum eight characters, at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(pass1);
  };

  const validatePass2 = (pass1: string, pass2: string) =>
    !!pass2 && pass1 === pass2;

  const isFormDisabled = !(
    isFirstNameValid &&
    isEmailValid &&
    isPass1Valid &&
    isPass2Valid &&
    termsOfUseAcknowledged
  );

  const handleSubmitResponseHandler = (res: IResponse) => {
    if (res) {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        console.log("Log in success for:", email);

        const newUserData = res.body;

        // Update user data for User Context
        _userData.updateUser(newUserData);

        // Update user data for local storage
        localStorage.setItem("userId", newUserData.userId);
        localStorage.setItem("auth", newUserData.auth);
      } else if (res.statusCode === STATUS_CODE.FAILURE) {
        let errorMessage;
        switch (res.statusMessage) {
          case STATUS_MESSAGE.EMAIL_ALREADY_EXISTS:
            errorMessage = "Email address already exists";
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
        firstName,
        email,
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

  return (
    <SignUpCanvas
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      firstName={firstName}
      isFirstNameValid={isFirstNameValid}
      email={email}
      isEmailValid={isEmailValid}
      pass1={pass1}
      isPass1Valid={isPass1Valid}
      pass2={pass2}
      isPass2Valid={isPass2Valid}
      termsOfUseAcknowledged={termsOfUseAcknowledged}
      setTermsOfUseAcknowledged={setTermsOfUseAcknowledged}
      isFormDisabled={isFormDisabled}
      isTermsOfUseDialogDisplayed={isTermsOfUseDialogDisplayed}
      setIsTermsOfUseDialogDisplayed={setIsTermsOfUseDialogDisplayed}
    />
  );
};

const SignUpProvider = () => (
  <UserDataContext.Consumer>
    {userData => <SignUpProviderWithContext userData={userData} />}
  </UserDataContext.Consumer>
);

export default SignUpProvider;
