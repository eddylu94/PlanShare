import React, { createRef, useRef, useState, useEffect } from "react";

const NUMBER_OF_VALIDATION_TEXT_INPUTS = 5;

const Validate = () => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (!inputFields.reduce((acc, curr) => (acc = acc || !curr), false)) {
      inputRefs.current[NUMBER_OF_VALIDATION_TEXT_INPUTS].current.focus();
    }
  }, [inputFields.reduce((acc, curr) => (acc = acc || !curr), false)]);

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <form className="form-container" onSubmit={handleSubmit}>
        <label className="form-label">
          Please enter the validation code sent to your email:
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

export default Validate;
