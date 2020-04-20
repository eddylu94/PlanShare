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
      <h3 className="settings-header">Delete account</h3>
      <div>
        <div>
          This action cannot be undone. This will permanently delete the {email}{" "}
          account, and remove all associated subscription listings. Please type
          your password to confirm.
        </div>
        <input
          className=""
          type="password"
          placeholder="Password"
          value={pass}
          onChange={handleInputChange}
        />
        <button className="" onClick={handleSubmit}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsCanvas;
