import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { UserDataContext } from "user-context-provider";
import { STATUS_CODE, STATUS_MESSAGE } from "@utils/constants";
import { log } from "@utils/utils";
import { getValidationEmail } from "@requests/getRequests";
import { resendConfirmationCode, verifyEmail } from "@requests/postRequests";

const ValidateDescription = () => {
  return (
    <>
      <h3 className="organizations-header" style={{ alignSelf: "center" }}>
        Email verification
      </h3>

      <img
        alt="Verify email"
        style={{ alignSelf: "center", width: 100 }}
        src={"./email_verification_icon.png"}
      />
    </>
  );
};

const Validate = (props: { history: History }) => {
  const _userData = useContext(UserDataContext);

  const { history } = props;

  const [validationEmail, setValidationEmail] = useState("");

  const [isIncorrectValidationCode, setIsIncorrectValidationCode] = useState(
    false
  );

  const [text, setText] = useState("");

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    setText(event.target.value);
  };

  useEffect(() => {
    retrieveValidationEmail();
    // eslint-disable-next-line
  }, []);

  const retrieveValidationEmailResponseHandler = (data: any) => {
    const email = data.body.email;
    if (!email) {
      history.push("/email");
    } else {
      setValidationEmail(email);
    }
  };

  const retrieveValidationEmail = () => {
    getValidationEmail(
      retrieveValidationEmailResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const handleSubmitResponseHandler = (res: any) => {
    if (
      res.statusCode === STATUS_CODE.FAILURE &&
      res.statusMessage === STATUS_MESSAGE.INCORRECT_VALIDATION_CODE
    ) {
      setIsIncorrectValidationCode(true);
    } else if (res.statusCode === STATUS_CODE.SUCCESS) {
      setIsIncorrectValidationCode(false);

      alert("Your email is now verified");
      history.push("/");
    } else if (res.statusCode === STATUS_CODE.FAILURE) {
      if (res.statusMessage === STATUS_MESSAGE.ACCOUNT_VALIDATION_LOCKED) {
        const errorMessage =
          "We're sorry, due to the number of recent validation attempts, account validation has been temporarily locked";
        log(errorMessage);
        alert(errorMessage);
      } else if (res.statusMessage === STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED) {
        alert(
          "Email address has already been validated for a different account"
        );
        log(res.statusMessage);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (text.length === 5) {
      verifyEmail(text, handleSubmitResponseHandler, log, _userData.user?.auth);
    }
  };

  const resendCodeResponseHandler = (res: any) => {
    if (res.statusCode === STATUS_CODE.SUCCESS) {
      alert("Your new validation code has been sent");
    }
  };

  const resendCode = () => {
    resendConfirmationCode(
      resendCodeResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <div className="form-container">
        <ValidateDescription />

        <label
          className="form-label"
          style={{ marginTop: 15, textAlign: "center" }}
        >
          Please enter the validation code sent to:
          <br />
          <span style={{ fontWeight: "bold" }}>{validationEmail}</span>
        </label>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 15,
            marginBottom: 15
          }}
        >
          <input
            key={"validate-text-input"}
            className="validate-text-input"
            name={"validate"}
            type="number"
            pattern="\d*"
            autoComplete="off"
            autoCapitalize="none"
            value={text}
            maxLength={1}
            placeholder="5 digit code"
            style={{ marginTop: 10 }}
            onChange={handleInputChange}
          />
          <input
            className="validate-submit-button"
            type="submit"
            value="Submit"
            disabled={text.length !== 5}
          />
          <div className="validate-incorrect-message">
            {isIncorrectValidationCode ? "Incorrect validation code" : ""}
          </div>
        </form>

        <label
          className="form-label"
          style={{ marginTop: 10, textAlign: "center" }}
        >
          Didn't receive an email?
          <br />
          <button
            className="validate-resend-code"
            onClick={resendCode}
            style={{ marginTop: 10 }}
          >
            Send me a new confirmation code
          </button>
        </label>
      </div>
    </div>
  );
};

export default withRouter(Validate);
