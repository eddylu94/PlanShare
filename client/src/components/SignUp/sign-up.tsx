import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { FORM_INPUT_TYPE } from "./sign-up-utils";
import {
  basePostRequest,
  slackPostRequest,
  ERROR_TYPE,
  SLACK_HOOK
} from "../../base-requests";
import { log, IResponse, validatePass, useDeviceMode } from "../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "../../utils/constants";
import { IUserContext, UserDataContext } from "../../user-context-provider";
import { Link } from "react-router-dom";

import TermsOfUse from "../TermsOfUse/terms-of-use";
import { KEYBOARD_CHAR_CODE } from "../../utils/utils";
import { TITLE } from "../../utils/constants";
import { DEVICE_MODE } from "../../utils/constants";

import Tooltip from "@material-ui/core/Tooltip";

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

  const deviceMode = useDeviceMode();

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
        log
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
      case "pass1":
        tooltip = "Do not use your password for work";
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

              <br />

              <div>
                Users can either post and browse publicly or privately with
                colleagues from{" "}
                <Link to="/organizations">these organizations</Link>.
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
              FORM_INPUT_TYPE.FIRST_NAME,
              "text",
              "First name",
              firstName,
              isFirstNameValid
            )}
            {renderTextInputWithValidation(
              FORM_INPUT_TYPE.USERNAME,
              "username",
              "Username",
              username,
              isUsernameValid
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

const SignUpProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <SignUpProviderWithContext userData={userData} history={props.history} />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(SignUpProvider);
