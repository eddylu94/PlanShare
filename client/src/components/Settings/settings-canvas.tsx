import React from "react";

interface ISettingsProps {
  email: string;
  pass: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const SettingsCanvas = (props: ISettingsProps) => {
  const { email, pass, handleInputChange, handleSubmit } = props;

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
            type="password"
            placeholder="Password"
            value={pass}
            onChange={handleInputChange}
          />
          <button className="settings-delete-button" onClick={handleSubmit}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsCanvas;
