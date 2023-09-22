import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { IUserContext, UserDataContext } from "user-context-provider";
import { slackPostRequest, SLACK_HOOK, ERROR_TYPE } from "base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "@utils/constants";
import { log } from "@utils/utils";
import { getValidationEmail } from "@requests/getRequests";
import { resendConfirmationCode, verifyEmail } from "@requests/postRequests";

const ValidateWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

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

      const postRequestData = {
        text: JSON.stringify({
          errorType: ERROR_TYPE.CLIENT,
          type: "VALIDATE",
          userId: _userData.user?.userId
        })
      };

      slackPostRequest(SLACK_HOOK.SIGNUPS, postRequestData);

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
        <label className="form-label">
          Please enter the validation code sent to:
          <br />
          <span style={{ fontWeight: "bold" }}>{validationEmail}</span>
        </label>
        <label className="form-label" style={{ marginTop: 10 }}>
          Didn't receive an email?
          <br />
          <button className="validate-resend-code" onClick={resendCode}>
            Send me a new confirmation code
          </button>
        </label>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
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
      </div>
    </div>
  );
};

const Validate = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <ValidateWithContext userData={userData} history={props.history} />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(Validate);
