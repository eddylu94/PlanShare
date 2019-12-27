import React from "react";

import { FORM_INPUT_TYPE } from "./sign-up-utils";

interface ISignUpCanvasProps {
  handleInputChange: (event: React.ChangeEvent<any>) => void;
  firstName: string;
  email1: string;
  email2: string;
  pass1: string;
  pass2: string;
  termsOfUseAcknowledged: boolean;
}

const SignUpCanvas = (props: ISignUpCanvasProps) => {
  const {
    handleInputChange,
    firstName,
    email1,
    email2,
    pass1,
    pass2,
    termsOfUseAcknowledged
  } = props;

  return (
    <form className="form-container">
      <input
        name={FORM_INPUT_TYPE.FIRST_NAME}
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={handleInputChange}
      />
      <input
        name={FORM_INPUT_TYPE.EMAIL1}
        type="email"
        placeholder="Personal email address"
        value={email1}
        onChange={handleInputChange}
      />
      <input
        name={FORM_INPUT_TYPE.EMAIL2}
        type="email"
        placeholder="Confirm email address"
        value={email2}
        onChange={handleInputChange}
      />
      <input
        name={FORM_INPUT_TYPE.PASS1}
        type="password"
        placeholder="Password"
        value={pass1}
        onChange={handleInputChange}
      />
      <input
        name={FORM_INPUT_TYPE.PASS2}
        type="password"
        placeholder="Confirm password"
        value={pass2}
        onChange={handleInputChange}
      />
      <label>
        By signing up, you agree to the Terms of Use
        <input
          name={FORM_INPUT_TYPE.TERMS_OF_USE_ACKNOWLEDGED}
          type="checkbox"
          checked={termsOfUseAcknowledged}
          onChange={handleInputChange}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default SignUpCanvas;
