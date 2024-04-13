import React, { useContext, useState } from "react";

import TextField from "@mui/material/TextField";
import { submitFeedback } from "@requests/post-requests/submitFeedback";
import { UserDataContext } from "user-context-provider";
import { log } from "@utils/utils";

const Feedback = () => {
  const _userData = useContext(UserDataContext);

  const [text, setText] = useState("");

  const handleSubmitFeedbackResponseHandler = () => {
    alert("Your feedback has been submitted!");
    setText("");
  };

  const onSubmit = () => {
    submitFeedback(
      text,
      handleSubmitFeedbackResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  return (
    <div className="page-container" style={{ alignItems: "center" }}>
      <div className="page-wrapper">
        <div className="feedback-container">
          <h2 className="form-header">Feedback</h2>
          Find any bugs? Have any questions, comments, or concerns? We would
          love your feedback!
          <TextField
            style={{ marginTop: 10, marginBottom: 10 }}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Anything that's on your mind!"
            multiline
            rows={5}
          />
          <input
            className="form-submit-button"
            type="submit"
            value="Submit"
            disabled={text.length === 0}
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Feedback;
