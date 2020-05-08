import React, { createRef, useRef, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";
import { log } from "./../../utils/utils";

const NUMBER_OF_VALIDATION_TEXT_INPUTS = 5;

const ValidateWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

  const [validationEmail, setValidationEmail] = useState("");

  const inputRefs: any = useRef(
    [...Array(NUMBER_OF_VALIDATION_TEXT_INPUTS)].map(() => createRef())
  );

  const [isIncorrectValidationCode, setIsIncorrectValidationCode] = useState(
    false
  );

  const inputFields = new Array(NUMBER_OF_VALIDATION_TEXT_INPUTS);
  const setInputFields = new Array(NUMBER_OF_VALIDATION_TEXT_INPUTS);

  // Cannot refactor the following logic into for loop due to following error:
  // "React Hook "useState" may be executed more than once."
  [inputFields[0], setInputFields[0]] = useState("");
  [inputFields[1], setInputFields[1]] = useState("");
  [inputFields[2], setInputFields[2]] = useState("");
  [inputFields[3], setInputFields[3]] = useState("");
  [inputFields[4], setInputFields[4]] = useState("");

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    const index = parseInt(name.replace("validate", ""), 10);

    setInputFields[index](value);

    if (index < NUMBER_OF_VALIDATION_TEXT_INPUTS - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    switch (event.key) {
      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1].current.focus();
          setInputFields[index - 1]("");
        }
        break;
      case "ArrowRight":
        if (index < NUMBER_OF_VALIDATION_TEXT_INPUTS - 1) {
          inputRefs.current[index + 1].current.focus();
          setInputFields[index + 1]("");
        }
        break;
      case "Backspace":
        if (index > 0) {
          inputRefs.current[index - 1].current.focus();
          setInputFields[index - 1]("");
        }
        break;
      case "Delete":
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    event.clipboardData.items[0].getAsString(text => {
      const length = Math.min(
        text.length,
        NUMBER_OF_VALIDATION_TEXT_INPUTS - index
      );
      const croppedString = text.substring(0, length);

      for (let i = 0; i < croppedString.length; i++) {
        setInputFields[index + i](croppedString[i]);
      }

      const focusIndex = Math.min(
        index + croppedString.length,
        NUMBER_OF_VALIDATION_TEXT_INPUTS - 1
      );
      inputRefs.current[focusIndex].current.focus();
    });
    event.preventDefault();
  };

  const validateInputField = (
    ref: React.MutableRefObject<any>,
    i: number,
    value: string
  ) => (
    <input
      key={"validate-text-input-" + i}
      ref={ref}
      className="validate-text-input"
      name={"validate" + i}
      type="number"
      pattern="\d*"
      autoComplete="off"
      autoCapitalize="none"
      value={value}
      maxLength={1}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onKeyDown={e => handleKeyDown(e, i)}
      onPaste={e => handlePaste(e, i)}
    />
  );

  const inputs = inputFields.map((field, i) =>
    validateInputField(inputRefs.current[i], i, field)
  );

  useEffect(() => {
    if (!inputFields.reduce((acc, curr) => (acc = acc || !curr), false)) {
      inputRefs.current[NUMBER_OF_VALIDATION_TEXT_INPUTS - 1].current.focus();
    }
  }, [inputFields]);

  useEffect(() => {
    retrieveValidationEmail();
    // eslint-disable-next-line
  }, []);

  const retrieveValidationEmailResponseHandler = (data: any) => {
    const email = data.body.email;
    if (email) {
      setValidationEmail(email);
    }
  };

  const retrieveValidationEmailErrorHandler = (error: any) => {
    log(error);
  };

  const retrieveValidationEmail = () => {
    baseGetRequest(
      "getvalidationemail",
      [],
      retrieveValidationEmailResponseHandler,
      retrieveValidationEmailErrorHandler,
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
      // log("Validation successful for:", email);
      setIsIncorrectValidationCode(false);
      alert("Your email is now verified");
      history.push("/");
    }
  };

  const handleSubmitErrorHandler = (error: any) => {
    log(error);
  };

  const handleSubmit = () => {
    const validationCode = inputFields.reduce((acc, curr) => (acc += curr), "");

    if (!inputFields.reduce((acc, curr) => (acc = acc || !curr), false)) {
      const postRequestData = {
        validationCode
      };
      log(_userData.user?.auth);
      basePostRequest(
        "verifyemail",
        postRequestData,
        handleSubmitResponseHandler,
        handleSubmitErrorHandler,
        _userData.user?.auth
      );
    }
  };

  useEffect(() => {
    const isValid = !inputFields.reduce(
      (acc, curr) => (acc = acc || !curr),
      false
    );
    if (isValid) {
      handleSubmit();
    }
    // eslint-disable-next-line
  }, [inputFields]);

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <form className="form-container">
        <label className="form-label">
          Please enter the validation code sent to
          <br />
          <span style={{ fontWeight: "bold" }}>{validationEmail}</span>:
        </label>
        <div className="validate-text-input-row">{inputs}</div>
        <div className="validate-incorrect-message">
          {isIncorrectValidationCode ? "Incorrect validation code" : ""}
        </div>
      </form>
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
