import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { basePostRequest } from "./../../base-requests";
import { log, IResponse } from "./../../utils/utils";
import { STATUS_CODE } from "./../../utils/constants";
import { IUserContext, UserDataContext } from "../../user-context-provider";

const EmailProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
  location: Location;
}) => {
  const _userData = props.userData;

  const { history } = props;

  // var params = new URLSearchParams(location.search);
  // const [orgSymbol, setOrgSymbol] = useState(params.get("org") as string);

  const [orgSymbol, setOrgSymbol] = useState("");

  const [text, setText] = useState("");

  const handleClick = (event: any, organizationSymbol: string) => {
    event.preventDefault();

    setOrgSymbol(organizationSymbol);
  };

  const getOrganizationDomain = (orgSymbol: string) => {
    switch (orgSymbol) {
      case "fake":
        return "gmail.com";
      case "msft":
        return "microsoft.com";
      case "lnkd":
        return "linkedin.com";
      case "github":
        return "github.com";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmitResponseHandler = (res: IResponse) => {
    if (res) {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        log("Email added:", text);

        history.push("/validate");
      } else if (res.statusCode === STATUS_CODE.FAILURE) {
        log(res.statusMessage);
      }
    } else {
      log("Error receiving response");
    }
  };

  const handleSubmitErrorHandler = (err: any) => {
    log(err);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateAlias(text)) {
      const postRequestData = {
        email: `${text}@${getOrganizationDomain(orgSymbol)}`
      };
      basePostRequest(
        "addemail",
        postRequestData,
        handleSubmitResponseHandler,
        handleSubmitErrorHandler,
        _userData.user?.auth
      );
    }
  };

  const validateAlias = (alias: string) => {
    const re = /^[a-zA-Z0-9_.-]*$/;
    return (
      re.test(alias) && !!alias.trim() && alias.length > 0 && alias.length < 30
    );
  };

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <div className="organizations-container">
        {!orgSymbol ? (
          <>
            <h3 className="organizations-header">
              Please verify your organization
            </h3>
            <p>
              To provide the safest experience for our members, we only allow
              users to view listing details from those that work at the same
              organizations.
            </p>
            <p>Please select one of the following organizations:</p>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "fake")}
            >
              <img
                alt="Google"
                src="goog_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">Google (fake)</div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "msft")}
            >
              <img
                alt="Microsoft"
                src="msft_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">Microsoft</div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "lnkd")}
            >
              <img
                alt="LinkedIn"
                src="lnkd_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">LinkedIn</div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "github")}
            >
              <img
                alt="GitHub"
                src="github_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">GitHub</div>
            </div>
          </>
        ) : (
          <>
            <h3 className="organizations-header">Please verify your email</h3>
            <form className="organization-email-form" onSubmit={handleSubmit}>
              <p>
                A verification code will be sent to your email address. After an
                hour, the verification code will expire.
              </p>
              <p style={{ fontStyle: "italic" }}>
                Your email address will not be visible to anyone but yourself.
              </p>
              <div className="organization-email-input">
                <input
                  className="organization-email-text-input"
                  onChange={handleChange}
                  value={text}
                  placeholder="Email alias"
                />
                <span className="organization-email-input-domain">
                  <span className="b">{text}</span>
                  {`@${getOrganizationDomain(orgSymbol)}`}
                </span>
              </div>
              <input
                className="email-submit-button"
                type="submit"
                value="Submit"
                disabled={!validateAlias(text)}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Email = (props: { history: History; location: any }) => (
  <UserDataContext.Consumer>
    {userData => (
      <EmailProviderWithContext
        userData={userData}
        history={props.history}
        location={props.location}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(Email);
