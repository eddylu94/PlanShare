import React from "react";

const Feedback = () => {
  return (
    <div className="page-container" style={{ alignItems: "center" }}>
      <div className="page-wrapper">
        <div className="feedback-container">
          <h2 className="form-header">Feedback</h2>
          Find any bugs? Have any questions, comments, or concerns? We would
          love your feedback!
          <br />
          <br />
          Please email us at:
          <br />
          <a href="mailto:admin@planshare.io">admin@planshare.io</a>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
