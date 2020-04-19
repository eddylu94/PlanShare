import React from "react";
import { Link } from "react-router-dom";

import { FORM_INPUT_TYPE } from "./sign-up-utils";
import TermsOfUse from "./../TermsOfUse/terms-of-use";
import { KEYBOARD_CHAR_CODE } from "../../utils/utils";

import Tooltip from "@material-ui/core/Tooltip";

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
  setTermsOfUseAcknowledged: (value: boolean) => void;
  isFormDisabled: boolean;
  isTermsOfUseDialogDisplayed: boolean;
  setIsTermsOfUseDialogDisplayed: (value: boolean) => void;
  isPassFocused: boolean;
  togglePassFocused: (value: boolean) => void;
  isEmailFocused: boolean;
  toggleEmailFocused: (value: boolean) => void;
}

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
    setTermsOfUseAcknowledged,
    isFormDisabled,
    isTermsOfUseDialogDisplayed,
    setIsTermsOfUseDialogDisplayed,
    isPassFocused,
    togglePassFocused,
    isEmailFocused,
    toggleEmailFocused
  } = props;

  const renderTextInputWithValidation = (
    name: string,
    type: string,
    placeholder: string,
    value: string,
    isValid: boolean
  ) => {
    let tooltip = "";
    switch (name) {
      case "email":
        tooltip = "To verify that you belong to a certain organization";
        break;
      case "pass1":
        tooltip = "Do not use your actual work password";
        break;
      default:
        break;
    }

    const onFocusHandler = () => {
      switch (name) {
        case "email":
          return toggleEmailFocused(true);
        case "pass1":
          return togglePassFocused(true);
        default:
          return {};
      }
    };

    const onBlurHandler = () => {
      switch (name) {
        case "email":
          return toggleEmailFocused(false);
        case "pass1":
          return togglePassFocused(false);
        default:
          return {};
      }
    };

    const isOpen =
      (name === "email" && isEmailFocused) ||
      (name === "pass1" && isPassFocused);

    return (
      <div
        key={"form-input-with-validation-" + name}
        className="form-text-input-with-validation"
      >
        <Tooltip
          title={tooltip}
          aria-label="add"
          placement="bottom-start"
          open={isOpen}
        >
          <input
            key={"form-input-" + name}
            className={"form-text-input"}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            autoComplete="off"
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
          />
        </Tooltip>
      </div>
    );
  };

  const handleClickTermsOfUse = () => {
    setIsTermsOfUseDialogDisplayed(true);
  };

  const handleKeyPressCheckbox = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.charCode === KEYBOARD_CHAR_CODE.SPACE) {
      setTermsOfUseAcknowledged(!termsOfUseAcknowledged);
    }
  };

  return (
    <div className="page-container" style={{ backgroundColor: "#6C5DBD" }}>
      <div className="sign-up-container">
        <form className="signup-form-container" onSubmit={handleSubmit}>
          {isTermsOfUseDialogDisplayed ? (
            <TermsOfUse
              setIsTermsOfUseDialogDisplayed={setIsTermsOfUseDialogDisplayed}
              setTermsOfUseAcknowledged={setTermsOfUseAcknowledged}
            />
          ) : null}
          <h2 className="signup-form-header">Sign Up</h2>
          {renderTextInputWithValidation(
            FORM_INPUT_TYPE.FIRST_NAME,
            "text",
            "First name",
            firstName,
            isFirstNameValid
          )}
          {renderTextInputWithValidation(
            FORM_INPUT_TYPE.EMAIL,
            "email",
            "Work email address",
            email,
            isEmailValid
          )}
          {renderTextInputWithValidation(
            FORM_INPUT_TYPE.PASS1,
            "password",
            "Password (8+ letters & nums)",
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
            <input
              name={FORM_INPUT_TYPE.TERMS_OF_USE_ACKNOWLEDGED}
              type="checkbox"
              checked={termsOfUseAcknowledged}
              onChange={handleInputChange}
              tabIndex={-1}
            />
            <span
              className="form-terms-checkmark"
              role="checkbox"
              aria-checked={termsOfUseAcknowledged}
              tabIndex={0}
              onKeyPress={handleKeyPressCheckbox}
            ></span>
            By signing up, you agree to the{" "}
            <span className="terms-label" onClick={handleClickTermsOfUse}>
              Terms of Use
            </span>
          </label>
          <input
            className="form-submit-button"
            type="submit"
            value="Submit"
            disabled={isFormDisabled}
          />
          <Link className="signup-toggle" to="/login">
            Already have an account? Log in here
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUpCanvas;
