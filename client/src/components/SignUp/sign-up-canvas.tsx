import React from "react";
import { Link } from "react-router-dom";

import { FORM_INPUT_TYPE } from "./sign-up-utils";
import TermsOfUse from "./../TermsOfUse/terms-of-use";
import { KEYBOARD_CHAR_CODE } from "../../utils/utils";
import { TITLE } from "./../../utils/constants";
import { DEVICE_MODE } from "./../../utils/constants";

import Tooltip from "@material-ui/core/Tooltip";
import useMediaQuery from "@material-ui/core/useMediaQuery";

interface ISignUpCanvasProps {
  handleInputChange: (event: React.ChangeEvent<any>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  email: string;
  isEmailValid: boolean;
  username: string;
  isUsernameValid: boolean;
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
    email,
    isEmailValid,
    username,
    isUsernameValid,
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
        tooltip =
          "To verify your current company; your email address will not be shown to anyone but yourself";
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

  const handleClickTermsOfUse = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsTermsOfUseDialogDisplayed(true);
  };

  const handleKeyPressCheckbox = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.charCode === KEYBOARD_CHAR_CODE.SPACE) {
      setTermsOfUseAcknowledged(!termsOfUseAcknowledged);
    }
  };

  const small = useMediaQuery("(max-width:768px)");
  const medium = useMediaQuery("(min-width:768px)");
  const large = useMediaQuery("(min-width:992px)");
  const xLarge = useMediaQuery("(min-width:1200px)");

  let deviceMode: string;
  if (small) {
    deviceMode = DEVICE_MODE.MOBILE;
  } else if (medium && !large) {
    deviceMode = DEVICE_MODE.TABLET;
  } else if (large && !xLarge) {
    deviceMode = DEVICE_MODE.DESKTOP;
  } else {
    deviceMode = DEVICE_MODE.LARGE_DESKTOP;
  }

  return (
    <div className="page-container" style={{ backgroundColor: "#6C5DBD" }}>
      <div className="sign-up-container">
        <div className="intro-and-signup">
          <div className="intro">
            <div className="intro-header">
              <div className="intro-logo-and-title">
                <img
                  alt={TITLE}
                  className="intro-icon"
                  src={"./icon_transparent.png"}
                />
                <span className="intro-title">{TITLE}</span>
              </div>
            </div>
            <div className="subscription-icons-container">
              <img
                alt="Subscriptions"
                className="subscription-icons"
                src={"./subscription_icons.png"}
              />
            </div>
            <div className="intro-footer">
              <div>
                <span className="b">{TITLE}</span> is a classifieds website that
                helps you find people to split costs on subscriptions,
                deliveries, and more.
              </div>

              <br />

              <div>
                After signing up and verifying your email address, you can
                either search through listings or post your own. Once you find a
                listing of interest, you can message the listing author and
                discuss how you want to complete the transaction.
              </div>
            </div>
          </div>
          {deviceMode === DEVICE_MODE.DESKTOP ||
          deviceMode === DEVICE_MODE.LARGE_DESKTOP ? (
            <div className="vertical-divider"></div>
          ) : (
            <div className="horizontal-divider"></div>
          )}
          <form className="signup-form-container" onSubmit={handleSubmit}>
            {isTermsOfUseDialogDisplayed ? (
              <TermsOfUse
                setIsTermsOfUseDialogDisplayed={setIsTermsOfUseDialogDisplayed}
                setTermsOfUseAcknowledged={setTermsOfUseAcknowledged}
              />
            ) : null}
            <h2 className="signup-form-header">Sign Up</h2>
            {renderTextInputWithValidation(
              FORM_INPUT_TYPE.USERNAME,
              "username",
              "Username",
              username,
              isUsernameValid
            )}
            {renderTextInputWithValidation(
              FORM_INPUT_TYPE.EMAIL,
              "email",
              "Email address",
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
    </div>
  );
};

export default SignUpCanvas;
