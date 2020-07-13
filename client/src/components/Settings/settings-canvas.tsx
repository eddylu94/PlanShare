import React from "react";

import { validatePass } from "./../../utils/utils";
import { SETTINGS_INPUT_NAME } from "./../../utils/constants";

interface ISettingsProps {
  email: string;
  pass: string;
  changePassCurrent: string;
  changePassNew1: string;
  changePassNew2: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleSubmitChangePass: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const SettingsCanvas = (props: ISettingsProps) => {
  const {
    email,
    pass,
    changePassCurrent,
    changePassNew1,
    changePassNew2,
    handleInputChange,
    handleSubmit,
    handleSubmitChangePass
  } = props;

  const isSubmitChangePassDisabled = !(
    !!changePassCurrent &&
    validatePass(changePassNew1) &&
    changePassNew1 === changePassNew2
  );

  return (
    <div className="page-container">
      <div className="settings-container">
        <h3 className="settings-header">Delete account</h3>
        <div>
          <div className="settings-delete-description">
            This action cannot be undone. This will permanently delete the{" "}
            <span className="b">{email}</span> account, and remove all
            associated subscription listings. Please type your password to
            confirm.
          </div>
          <input
            className="settings-delete-text-input"
            name={SETTINGS_INPUT_NAME.DELETE_ACCOUNT_PASS}
            type="password"
            placeholder="Password"
            value={pass}
            onChange={handleInputChange}
          />
          <button
            className="settings-delete-button"
            onClick={handleSubmit}
            disabled={!pass}
          >
            Delete Account
          </button>
        </div>
      </div>

      <div className="settings-container" style={{ marginTop: 20 }}>
        <h3 className="settings-header">Change Password</h3>
        <div>
          <div className="settings-delete-description">
            Please enter your current password:
          </div>
          <input
            className="settings-delete-text-input"
            name={SETTINGS_INPUT_NAME.CHANGE_PASS_CURRENT}
            type="password"
            placeholder="Current password"
            value={changePassCurrent}
            onChange={handleInputChange}
            style={{ width: "100%" }}
          />
          <div className="settings-delete-description">
            Please enter your new password (8+ chracters with letters and
            numbers):
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              className="settings-delete-text-input"
              name={SETTINGS_INPUT_NAME.CHANGE_PASS_NEW_1}
              type="password"
              placeholder="New password"
              value={changePassNew1}
              onChange={handleInputChange}
            />
            <input
              className="settings-delete-text-input"
              name={SETTINGS_INPUT_NAME.CHANGE_PASS_NEW_2}
              type="password"
              placeholder="Confirm new password"
              value={changePassNew2}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="settings-delete-button"
            onClick={handleSubmitChangePass}
            style={{ marginTop: 20 }}
            disabled={isSubmitChangePassDisabled}
          >
            Change password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsCanvas;
