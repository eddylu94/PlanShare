import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { log, IResponse } from "@utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "@utils/constants";
import { UserDataContext } from "user-context-provider";
import { InputChangeEvent } from "@utils/interfaces";
import { addEmail } from "@requests/postRequests";

import TextField from "@mui/material/TextField";

const Email = (props: { history: History; location: any }) => {
  const _userData = useContext(UserDataContext);

  const { history, location } = props;

  // var params = new URLSearchParams(location.search);
  // const [orgSymbol, setOrgSymbol] = useState(params.get("org") as string);

  var params = new URLSearchParams(location.search);
  const developmentParam = params.get("development") as string;

  // eslint-disable-next-line
  const [isDevelopment, setIsDevelopment] = useState(
    developmentParam === "true"
  );

  const [orgSymbol, setOrgSymbol] = useState("");

  const [text, setText] = useState("");

  const [isValidAlias, setIsValidAlias] = useState(false);

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
      case "amzn":
        return "amazon.com";
      case "fb":
        return "fb.com";
      case "aapl":
        return "apple.com";
      case "goog":
        return "google.com";
      case "mcgill_u":
        return "mail.mcgill.ca";
      case "u_of_toronto":
        return "mail.utoronto.ca";
      case "queensu":
        return "queensu.ca";
      case "washu_stl":
        return "wustl.edu";
      case "u_of_wa":
        return "uw.edu";
      default:
        return "";
    }
  };

  const handleChange = (e: InputChangeEvent) => {
    setText(e.target.value);
  };

  const handleSubmitResponseHandler = (res: IResponse) => {
    if (res) {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        log("Email added:", text);

        history.push("/validate");
      } else if (res.statusCode === STATUS_CODE.FAILURE) {
        if (res.statusMessage === STATUS_MESSAGE.EMAIL_ALREADY_VALIDATED) {
          alert(
            "Email address has already been validated for a different account"
          );
          log(res.statusMessage);
        } else {
          log(res.statusMessage);
        }
      }
    } else {
      log("Error receiving response");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValidAlias) {
      const email =
        orgSymbol === "public"
          ? text
          : `${text}@${getOrganizationDomain(orgSymbol)}`;

      addEmail(email, handleSubmitResponseHandler, log, _userData.user?.auth);
    }
  };

  useEffect(() => {
    const alias = text;

    if (orgSymbol === "public") {
      const isValid = !!alias.trim() && alias.length > 0 && alias.length < 30;
      setIsValidAlias(isValid);
      return;
    }

    const re = /^[a-zA-Z0-9_.-]*$/;

    const isValid =
      re.test(alias) && !!alias.trim() && alias.length > 0 && alias.length < 30;
    setIsValidAlias(isValid);
    // eslint-disable-next-line
  }, [text]);

  return (
    <div className="page-container" style={{ alignItems: "center" }}>
      <div className="organizations-container">
        {!orgSymbol ? (
          <>
            <h3 className="organizations-header">
              Please verify your organization
            </h3>
            <p>
              By signing up with your work/university email address, you will be
              able to view{" "}
              <span className="b">
                both listings posted by users in the same organization as well
                as public listings
              </span>
              .
            </p>
            <p>
              However, we understand that not everyone wants feels safe using
              their work/university emails. Therefore, we provide the option to
              create public accounts where users may use any email address.
              Public users can{" "}
              <span className="b">only view public listings</span>.
            </p>

            <p>Please either choose a public account:</p>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "public")}
            >
              <img
                alt="Public"
                src="public_icon.png"
                className="organization-logo"
                style={{ opacity: 0.7 }}
              />
              <div className="organizations-label">Public</div>
            </div>

            <p>or an organizational account:</p>

            {process.env.NODE_ENV === "development" || isDevelopment ? (
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
            ) : null}

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

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "amzn")}
            >
              <img
                alt="Amazon"
                src="amzn_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">Amazon</div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "fb")}
            >
              <img
                alt="Facebook"
                src="fb_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">Facebook</div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "aapl")}
            >
              <img
                alt="Apple"
                src="aapl_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">Apple</div>
            </div>

            {/* <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "mcgill_u")}
            >
              <img
                alt="McGill University"
                src="mcgill_u_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">McGill University</div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "u_of_toronto")}
            >
              <img
                alt="University of Toronto"
                src="u_of_toronto_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">University of Toronto</div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "queensu")}
            >
              <img
                alt="Queen's University"
                src="queensu_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">Queen's University</div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "washu_stl")}
            >
              <img
                alt="Washington University, St. Louis"
                src="washu_stl_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">
                Washington University, St. Louis
              </div>
            </div>

            <div
              className="organizations-organization organizations-organization-card"
              onClick={e => handleClick(e, "u_of_wa")}
            >
              <img
                alt="University of Washington"
                src="u_of_wa_logo.png"
                className="organization-logo"
              />
              <div className="organizations-label">
                University of Washington
              </div>
            </div> */}
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
                <TextField
                  style={{ width: orgSymbol === "public" ? 300 : 200 }}
                  onChange={handleChange}
                  value={text}
                  placeholder={
                    orgSymbol === "public" ? "Email address" : "Email alias"
                  }
                />
                {orgSymbol !== "public" ? (
                  <span className="organization-email-input-domain">
                    <span className="b">{text}</span>
                    {`@${getOrganizationDomain(orgSymbol)}`}
                  </span>
                ) : null}
              </div>
              <input
                className="form-submit-button email-submit-button"
                type="submit"
                value="Submit"
                disabled={!isValidAlias}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(Email);
