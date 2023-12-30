import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { FORM_INPUT_TYPE } from "./sign-up-utils";
import { log, IResponse, validatePass, useDeviceMode } from "@utils/utils";
import { DEVICE_MODE, STATUS_CODE, STATUS_MESSAGE } from "@utils/constants";
import { UserDataContext } from "user-context-provider";
import { Link } from "react-router-dom";

import TermsOfUse from "@components/TermsOfUse/terms-of-use";
import { TITLE } from "@utils/constants";

import TextField from "@mui/material/TextField";
import { Checkbox, FormControlLabel } from "@mui/material";

import { signup } from "@requests/postRequests";

const SignUpProvider = (props: { history: History }) => {
  const _userData = useContext(UserDataContext);

  const { history } = props;

  if (_userData.user?.userId) {
    history.push("/search");
  }

  const [firstName, setFirstName] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);

  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

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
      signup(
        firstName,
        username.toLocaleLowerCase(),
        pass1,
        handleSubmitResponseHandler,
        log
      );
    }

    event.preventDefault();
  };

  const handleClickTermsOfUse = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsTermsOfUseDialogDisplayed(true);
  };

  const deviceMode = useDeviceMode();

  return (
    <div
      className="page-container"
      style={{
        backgroundColor: "#f3f1ff",
        ...(deviceMode === DEVICE_MODE.MOBILE && { padding: 0 })
      }}
    >
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
                helps you find people to split costs on subscriptions, group
                purchases, and more.
              </div>

              <br />

              <div>
                Users can either post and browse publicly or privately with
                colleagues from{" "}
                <Link to="/organizations">these organizations</Link>.
              </div>
            </div>
          </div>
          <form className="signup-form-container" onSubmit={handleSubmit}>
            {isTermsOfUseDialogDisplayed ? (
              <TermsOfUse
                setIsTermsOfUseDialogDisplayed={setIsTermsOfUseDialogDisplayed}
                setTermsOfUseAcknowledged={setTermsOfUseAcknowledged}
              />
            ) : null}
            <h2 className="signup-form-header">Sign Up</h2>
            <TextField
              error={!isFirstNameValid && firstName.length > 0}
              label="First name"
              name={FORM_INPUT_TYPE.FIRST_NAME}
              value={firstName}
              onChange={handleInputChange}
              margin="dense"
              autoComplete="off"
            />
            <TextField
              error={!isUsernameValid && username.length > 0}
              label="Username"
              helperText={
                !isUsernameValid && username.length > 0
                  ? "Only letters and numbers"
                  : undefined
              }
              name={FORM_INPUT_TYPE.USERNAME}
              value={username}
              onChange={handleInputChange}
              margin="dense"
              autoComplete="off"
            />
            <TextField
              error={!isPass1Valid && pass1.length > 0}
              label="Password"
              helperText={
                !isPass1Valid && pass1.length > 0
                  ? "8+ characters with both letters and numbers"
                  : undefined
              }
              name={FORM_INPUT_TYPE.PASS1}
              value={pass1}
              onChange={handleInputChange}
              type="password"
              margin="dense"
              autoComplete="off"
            />
            <TextField
              error={!isPass2Valid && pass2.length > 0}
              label="Confirm password"
              helperText={
                !isPass2Valid && pass2.length > 0
                  ? "Must be same as line above"
                  : undefined
              }
              name={FORM_INPUT_TYPE.PASS2}
              value={pass2}
              onChange={handleInputChange}
              type="password"
              margin="dense"
              autoComplete="off"
            />
            <label className="form-terms-container">
              <FormControlLabel
                control={
                  <Checkbox
                    value={termsOfUseAcknowledged}
                    onChange={() =>
                      setTermsOfUseAcknowledged(!termsOfUseAcknowledged)
                    }
                    sx={{
                      color: "#6c5dbd",
                      "&.Mui-checked": {
                        color: "#6c5dbd"
                      }
                    }}
                  />
                }
                label={
                  <>
                    By signing up, you agree to the{" "}
                    <span
                      className="terms-label"
                      onClick={handleClickTermsOfUse}
                    >
                      Terms of Use
                    </span>
                  </>
                }
              />
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
            <Link className="signup-toggle" to="/">
              Browse as guest
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SignUpProvider);
