import React from "react";
import { Link } from "react-router-dom";

import { FORM_INPUT_TYPE } from "./login-utils";

interface ILoginCanvasProps {
  handleInputChange: (event: React.ChangeEvent<any>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  email: string;
  pass: string;
  isFormDisabled: boolean;
}

const LoginCanvas = (props: ILoginCanvasProps) => {
  const {
    handleInputChange,
    handleSubmit,
    email,
    pass,
    isFormDisabled
  } = props;

  const renderTextInputWithValidation = (
    name: string,
    type: string,
    placeholder: string,
    value: string,
    isValid?: boolean
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
    </div>
  );

  return (
    <div className="page-container" style={{ backgroundColor: "#6C5DBD" }}>
      <div className="login-container">
        <form className="signup-form-container" onSubmit={handleSubmit}>
          <h2 className="form-header">Welcome back!</h2>
          {renderTextInputWithValidation(
            FORM_INPUT_TYPE.EMAIL,
            "email",
            "Email address",
            email
          )}
          {renderTextInputWithValidation(
            FORM_INPUT_TYPE.PASS,
            "password",
            "Password",
            pass
          )}
          <input
            className="form-submit-button"
            type="submit"
            value="Submit"
            disabled={isFormDisabled}
          />
          <Link className="signup-toggle" to="/signup">
            Need to create an account? Sign up here
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginCanvas;
