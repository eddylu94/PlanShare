import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { log, IResponse } from "@utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "@utils/constants";
import { UserDataContext } from "user-context-provider";
import { InputChangeEvent } from "@utils/interfaces";
import { addEmail } from "@requests/postRequests";

import TextField from "@mui/material/TextField";

const EmailDescription = () => {
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

      <p>To complete your sign-up, please provide your email.</p>
      <p style={{ fontStyle: "italic", marginBottom: 20, marginTop: 5 }}>
        Your email address will only be used for account management/settings and
        will not be visible to anyone but yourself.
      </p>
    </>
  );
};

const Email = (props: { history: History }) => {
  const _userData = useContext(UserDataContext);

  const { history } = props;

  const [text, setText] = useState("");

  const handleChange = (e: InputChangeEvent) => {
    setText(e.target.value);
  };

  const handleSubmitResponseHandler = (res: IResponse) => {
    if (res) {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        log("Email added:", text);

        history.push("/validate");
      } else if (res.statusCode === STATUS_CODE.FAILURE) {
        if (res.statusMessage === STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED) {
          alert(
            "Email address has already been validated for a different account"
          );
          log(res.statusMessage);
        } else {
          log(res.statusMessage);
        }
      }
    } else {
      log("Error receiving response");
    }
  };

  const isValidEmail = (email: string) => {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return text.length > 0 && text.length < 30 && emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValidEmail(text)) {
      addEmail(text, handleSubmitResponseHandler, log, _userData.user?.auth);
    }
  };

  let errorText = "";
  if (text.length > 0) {
    if (!isValidEmail(text)) {
      errorText = "Please enter a valid email address";
    }
  }

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", padding: 0 }}
    >
      <div className="organizations-container">
        <>
          <form className="organization-email-form" onSubmit={handleSubmit}>
            <EmailDescription />
            <div className="organization-email-input">
              <TextField
                onChange={handleChange}
                value={text}
                error={text.length > 0 && !isValidEmail(text)}
                helperText={errorText}
                placeholder="name@example.com"
              />
            </div>
            <input
              className="form-submit-button email-submit-button"
              type="submit"
              value="Submit"
              disabled={!isValidEmail(text)}
              style={{ marginBottom: 20 }}
            />
          </form>
        </>
      </div>
    </div>
  );
};

export default withRouter(Email);
