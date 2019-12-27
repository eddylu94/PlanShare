import React, { useState } from "react";
import SignUpCanvas from "./sign-up-canvas";
import { FORM_INPUT_TYPE } from "./sign-up-utils";

const SignUpProvider = () => {
  const [firstName, setFirstName] = useState("");
  const [email1, setEmail1] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [termsOfUseAcknowledged, setTermsOfUseAcknowledged] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case FORM_INPUT_TYPE.FIRST_NAME:
        setFirstName(value);
        break;
      case FORM_INPUT_TYPE.EMAIL1:
        setEmail1(value);
        break;
      case FORM_INPUT_TYPE.PASS1:
        setPass1(value);
        break;
      case FORM_INPUT_TYPE.PASS2:
        setPass2(value);
        break;
      case FORM_INPUT_TYPE.TERMS_OF_USE_ACKNOWLEDGED:
        setTermsOfUseAcknowledged(value);
        break;
      default:
        break;
    }
  };

  return (
    <SignUpCanvas
      handleInputChange={handleInputChange}
      firstName={firstName}
      email1={email1}
      pass1={pass1}
      pass2={pass2}
      termsOfUseAcknowledged={termsOfUseAcknowledged}
    />
  );
};

export default SignUpProvider;
