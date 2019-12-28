import React from "react";

import { FORM_INPUT_TYPE } from "./sign-up-utils";

interface ISignUpCanvasProps {
  handleInputChange: (event: React.ChangeEvent<any>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  firstName: string;
  isFirstNameValid: boolean;
  email: string;
  isEmailValid: boolean;
  pass1: string;
  isPass1Valid: boolean;
  pass2: string;
  isPass2Valid: boolean;
  termsOfUseAcknowledged: boolean;
  isFormDisabled: boolean;
}

interface ITextInputWithValidationProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  isValid: boolean;
}

const ValidIcon = () => (
  <span className="validity-icon valid-icon">&#10004;</span>
);

const InvalidIcon = () => (
  <span className="validity-icon invalid-icon">&#10006;</span>
);

const SignUpCanvas = (props: ISignUpCanvasProps) => {
  const {
    handleInputChange,
    handleSubmit,
    firstName,
    isFirstNameValid,
    email,
    isEmailValid,
    pass1,
    isPass1Valid,
    pass2,
    isPass2Valid,
    termsOfUseAcknowledged,
    isFormDisabled
  } = props;

  const renderTextInputWithValidation = (
    name: string,
    type: string,
    placeholder: string,
    value: string,
    isValid: boolean
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
      {isValid ? <ValidIcon /> : <InvalidIcon />}
    </div>
  );

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-header">Sign Up</h2>
      {renderTextInputWithValidation(
        FORM_INPUT_TYPE.FIRST_NAME,
        "text",
        "First name",
        firstName,
        isFirstNameValid
      )}
      {renderTextInputWithValidation(
        FORM_INPUT_TYPE.EMAIL1,
        "email1",
        "Personal email address",
        email,
        isEmailValid
      )}
      {renderTextInputWithValidation(
        FORM_INPUT_TYPE.PASS1,
        "password",
        "Password (8+ char. with letters and numbers)",
        pass1,
        isPass1Valid
      )}
      {renderTextInputWithValidation(
        FORM_INPUT_TYPE.PASS2,
        "password",
        "Confirm password",
        pass2,
        isPass2Valid
      )}
      <label className="form-terms-container">
        By signing up, you agree to the Terms of Use
        <input
          name={FORM_INPUT_TYPE.TERMS_OF_USE_ACKNOWLEDGED}
          type="checkbox"
          checked={termsOfUseAcknowledged}
          onChange={handleInputChange}
        />
        <span className="form-terms-checkmark"></span>
      </label>
      <input
        className="form-submit-button"
        type="submit"
        value="Submit"
        disabled={isFormDisabled}
      />
    </form>
  );
};

export default SignUpCanvas;
