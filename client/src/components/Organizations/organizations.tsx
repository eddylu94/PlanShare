import React from "react";

const Organizations = () => {
  return (
    <div className="page-container">
      <div className="organizations-container">
        <h3 className="organizations-header">Organizations</h3>
        <div className="organizations-subheader">
          Our platform currently supports listings for those whom are members of
          the following organizations:
        </div>

        <div className="organizations-organization">
          <img
            alt="Microsoft"
            src="msft_logo.png"
            className="organization-logo"
          />
          <div className="organizations-label">Microsoft</div>
        </div>

        <div className="organizations-organization">
          <img
            alt="LinkedIn"
            src="lnkd_logo.png"
            className="organization-logo"
          />
          <div className="organizations-label">LinkedIn</div>
        </div>

        <div className="organizations-organization">
          <img
            alt="GitHub"
            src="github_logo.png"
            className="organization-logo"
          />
          <div className="organizations-label">GitHub</div>
        </div>

        <div className="organizations-organization">
          <img alt="Amazon" src="amzn_logo.png" className="organization-logo" />
          <div className="organizations-label">Amazon</div>
        </div>

        <div className="organizations-organization">
          <img alt="Facebook" src="fb_logo.png" className="organization-logo" />
          <div className="organizations-label">Facebook</div>
        </div>

        <div className="organizations-organization">
          <img alt="Apple" src="aapl_logo.png" className="organization-logo" />
          <div className="organizations-label">Apple</div>
        </div>

        <div className="organizations-organization">
          <img alt="Google" src="goog_logo.png" className="organization-logo" />
          <div className="organizations-label">Google</div>
        </div>
      </div>
    </div>
  );
};

export default Organizations;
