import React, { createRef, useRef, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import { STATUS_CODE } from "./../../utils/constants";

const NUMBER_OF_VALIDATION_TEXT_INPUTS = 5;

const ValidateWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

  const [validationEmail, setValidationEmail] = useState("");

  const inputRefs: any = useRef(
    [...Array(NUMBER_OF_VALIDATION_TEXT_INPUTS + 1)].map(() => createRef())
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

    if (index < NUMBER_OF_VALIDATION_TEXT_INPUTS) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const target: any = event.target;
    const name = target.name;

    const index = parseInt(name.replace("validate", ""), 10);

    setInputFields[index]("");

    event.target.select();
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
      type="text"
      value={value}
      maxLength={1}
      onChange={handleInputChange}
      onFocus={handleFocus}
    />
  );

  const inputs = inputFields.map((field, i) =>
    validateInputField(inputRefs.current[i], i, field)
  );

  useEffect(() => {
    if (!inputFields.reduce((acc, curr) => (acc = acc || !curr), false)) {
      inputRefs.current[NUMBER_OF_VALIDATION_TEXT_INPUTS].current.focus();
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
    console.log(error);
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
    if (res.statusCode === STATUS_CODE.SUCCESS) {
      // console.log("Validation successful for:", email);
      history.push("/");
    }
  };

  const handleSubmitErrorHandler = (error: any) => {
    console.log(error);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const validationCode = inputFields.reduce((acc, curr) => (acc += curr), "");

    if (!inputFields.reduce((acc, curr) => (acc = acc || !curr), false)) {
      const postRequestData = {
        validationCode
      };
      console.log(_userData.user?.auth);
      basePostRequest(
        "verifyemail",
        postRequestData,
        handleSubmitResponseHandler,
        handleSubmitErrorHandler,
        _userData.user?.auth
      );
    }

    event.preventDefault();
  };

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <form className="form-container" onSubmit={handleSubmit}>
        <label className="form-label">
          Please enter the validation code sent to{" "}
          <span style={{ fontWeight: "bold" }}>{validationEmail}</span>:
        </label>
        <div className="validate-text-input-row">
          {inputs}
          <input
            ref={inputRefs.current[NUMBER_OF_VALIDATION_TEXT_INPUTS]}
            className="form-submit-button"
            style={{ marginLeft: 20, width: 100 }}
            type="submit"
            value="Submit"
            disabled={inputFields.reduce(
              (acc, curr) => (acc = acc || !curr),
              false
            )}
          />
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
