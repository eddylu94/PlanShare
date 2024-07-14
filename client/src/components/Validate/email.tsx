import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { log, IResponse } from "@utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "@utils/constants";
import { UserDataContext } from "user-context-provider";
import { InputChangeEvent } from "@utils/interfaces";
import { addEmail } from "@requests/postRequests";

import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import {
  IVerificationOrganization,
  OrganizationType,
  PUBLIC_ORGANIZATION
} from "./organizations";
import { getOrganizations } from "@requests/getRequests";

const EmailDescription = () => {
  return (
    <>
      <h3 className="organizations-header" style={{ alignSelf: "center" }}>
        Email verification
      </h3>

      <img
        alt="Verify email"
        style={{ alignSelf: "center", width: 100 }}
        src={"./email_verification_icon.png"}
      />

      <p>To complete your sign-up, please provide your email.</p>
      <p style={{ fontStyle: "italic", marginBottom: 20, marginTop: 5 }}>
        Your email address will only be used for account management/settings and
        will not be visible to anyone but yourself.
      </p>
    </>
  );
};

const Email = (props: { history: History }) => {
  const _userData = useContext(UserDataContext);

  const { history } = props;

  const [
    selectedOrganization,
    setSelectedOrganization
  ] = useState<IVerificationOrganization | null>(PUBLIC_ORGANIZATION);

  const [organizations, setOrganizations] = useState<Array<
    IVerificationOrganization
  > | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [orgCategory, setOrgCategory] = useState(OrganizationType.COMPANY);

  const retrieveOrganizationResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      setOrganizations([PUBLIC_ORGANIZATION, ...data.body.organizations]);
    }

    setIsLoading(false);
  };

  const retrieveOrganizationErrorHandler = (value: any, params?: any) => {
    log(value, params);
    setIsLoading(false);
  };

  const retrieveOrganizations = () => {
    getOrganizations(
      retrieveOrganizationResponseHandler,
      retrieveOrganizationErrorHandler
    );
  };

  useEffect(() => {
    retrieveOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [text, setText] = useState("");

  const handleClick = (event: any, org: IVerificationOrganization) => {
    event.preventDefault();

    setSelectedOrganization(org);
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

  const isPublic = selectedOrganization?.organizationId === "PUBLIC";

  const isValidEmail = (email: string) => {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return text.length > 0 && text.length < 30 && emailRegex.test(email);
  };

  const isValidOrgEmail =
    isValidEmail(text) &&
    (isPublic || text.endsWith(selectedOrganization?.domains[0]!));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValidOrgEmail) {
      addEmail(text, handleSubmitResponseHandler, log, _userData.user?.auth);
    }
  };

  let errorText = "";
  if (text.length > 0) {
    if (!isValidEmail(text)) {
      errorText = "Please enter a valid email address";
    } else if (!isValidOrgEmail) {
      errorText = `Email should end with ${selectedOrganization?.domains[0]}`;
    }
  }

  const renderOrganizations = (
    organizations: Array<IVerificationOrganization> | null
  ) => {
    if (isLoading) {
      return null;
    }

    const orgs = (organizations ?? [])
      .filter(org => org.type === orgCategory)
      .filter(org =>
        searchText === ""
          ? true
          : org.name
              .toLocaleLowerCase()
              .includes(searchText.toLocaleLowerCase())
      )
      .map(org => {
        return (
          <div
            className="organizations-organization organizations-organization-card"
            onClick={e => handleClick(e, org)}
          >
            <img alt={org.name} src={org.logo} className="organization-logo" />
            <div className="organizations-label">{org.name}</div>
          </div>
        );
      });

    return orgs.length > 0 ? (
      orgs
    ) : (
      <div className="i">No organizations found</div>
    );
  };

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", padding: 0 }}
    >
      <div className="organizations-container">
        {selectedOrganization == null ? (
          <>
            <EmailDescription />

            <button
              className="email-select-different-org"
              onClick={_e => setSelectedOrganization(PUBLIC_ORGANIZATION)}
              style={{
                textAlign: "left",
                marginBottom: 15,
                paddingLeft: 0,
                textDecoration: "underline"
              }}
            >
              I prefer to use my personal email
            </button>

            <ToggleButtonGroup
              color="primary"
              value={orgCategory}
              exclusive
              onChange={(_e, value) => setOrgCategory(value)}
              aria-label="Organization category"
              style={{ margin: "10px 0" }}
            >
              <ToggleButton
                value={OrganizationType.COMPANY}
                style={{ width: "49%" }}
              >
                Company
              </ToggleButton>
              <ToggleButton
                value={OrganizationType.UNIVERSITY}
                style={{ width: "49%" }}
              >
                University
              </ToggleButton>
            </ToggleButtonGroup>

            {orgCategory !== OrganizationType.PUBLIC && (
              <TextField
                label="Search for organization"
                name="organization"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                margin="dense"
                style={{ marginBottom: 10 }}
                autoComplete="off"
              />
            )}

            {renderOrganizations(organizations)}
          </>
        ) : (
          <>
            {!isPublic && (
              <div className="organizations-organization">
                <img
                  alt={selectedOrganization.name}
                  src={selectedOrganization.logo}
                  className="organization-logo"
                />
                <div className="organizations-label">
                  {selectedOrganization.name}
                </div>
              </div>
            )}

            <form className="organization-email-form" onSubmit={handleSubmit}>
              <EmailDescription />
              <div className="organization-email-input">
                <TextField
                  onChange={handleChange}
                  value={text}
                  error={text.length > 0 && !isValidOrgEmail}
                  helperText={errorText}
                  placeholder={`name@${selectedOrganization.domains[0]}`}
                />
              </div>
              <input
                className="form-submit-button email-submit-button"
                type="submit"
                value="Submit"
                disabled={!isValidOrgEmail}
                style={{ marginBottom: 20 }}
              />

              {selectedOrganization !== PUBLIC_ORGANIZATION ? (
                <>
                  <button
                    className="email-select-different-org"
                    onClick={_e => setSelectedOrganization(null)}
                    style={{ marginBottom: 15 }}
                  >
                    Select a different organization
                  </button>
                  <button
                    className="email-select-different-org"
                    onClick={_e => setSelectedOrganization(PUBLIC_ORGANIZATION)}
                    style={{ textDecoration: "underline" }}
                  >
                    I prefer to use my personal email
                  </button>
                </>
              ) : (
                <>
                  <p>
                    If you prefer, you can also provide your work or university
                    email to post and view listings within your organization for
                    added trust and privacy. This is totally optional!
                  </p>
                  <button
                    className="email-select-different-org"
                    onClick={_e => setSelectedOrganization(null)}
                    style={{ textDecoration: "underline", fontSize: 16 }}
                  >
                    Select an organization
                  </button>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(Email);
