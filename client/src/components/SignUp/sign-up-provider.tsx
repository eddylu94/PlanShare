import React, { useState } from "react";
import SignUpCanvas from "./sign-up-canvas";
import { FORM_INPUT_TYPE } from "./sign-up-utils";
import { basePostRequest } from "./../../base-requests";

const SignUpProvider = () => {
  const [firstName, setFirstName] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [pass1, setPass1] = useState("");
  const [isPass1Valid, setIsPass1Valid] = useState(false);

  const [pass2, setPass2] = useState("");
  const [isPass2Valid, setIsPass2Valid] = useState(false);

  const [termsOfUseAcknowledged, setTermsOfUseAcknowledged] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case FORM_INPUT_TYPE.FIRST_NAME:
        setFirstName(value);
        setIsFirstNameValid(validateFirstName(value));
        break;
      case FORM_INPUT_TYPE.EMAIL1:
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
    return re.test(firstName);
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

  const handleSubmitResponseHandler = (res: any) => {
    console.log(res);
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
      isFormDisabled={isFormDisabled}
    />
  );
};

export default SignUpProvider;
