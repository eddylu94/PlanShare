import {
  IVerificationOrganization,
  OrganizationType
} from "@components/Validate/organizations";
import { getOrganizations } from "@requests/getRequests";
import { STATUS_CODE } from "@utils/constants";
import { log } from "@utils/utils";
import React, { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const Organizations = () => {
  const [organizations, setOrganizations] = useState<Array<
    IVerificationOrganization
  > | null>(null);

  const [searchText, setSearchText] = useState("");
  const [orgCategory, setOrgCategory] = useState(OrganizationType.COMPANY);

  const retrieveOrganizationResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      setOrganizations(data.body.organizations);
    }
  };

  const retrieveOrganizations = () => {
    getOrganizations(retrieveOrganizationResponseHandler, log);
  };

  useEffect(() => {
    retrieveOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCompanies = (organizations: Array<IVerificationOrganization>) => {
    const companies = organizations
      .filter(org => org.type === OrganizationType.COMPANY)
      .filter(org =>
        searchText === ""
          ? true
          : org.name
              .toLocaleLowerCase()
              .includes(searchText.toLocaleLowerCase())
      )
      .map(org => {
        return (
          <div className="organizations-organization" key={org.organizationId}>
            <img alt={org.name} src={org.logo} className="organization-logo" />
            <div className="organizations-label">{org.name}</div>
          </div>
        );
      });

    return companies.length > 0 ? (
      companies
    ) : (
      <div className="i">No companies found</div>
    );
  };

  const renderUniversities = (
    organizations: Array<IVerificationOrganization>
  ) => {
    const universities = organizations
      .filter(org => org.type === OrganizationType.UNIVERSITY)
      .filter(org =>
        searchText === ""
          ? true
          : org.name
              .toLocaleLowerCase()
              .includes(searchText.toLocaleLowerCase())
      )
      .map(org => {
        return (
          <div className="organizations-organization" key={org.organizationId}>
            <img alt={org.name} src={org.logo} className="organization-logo" />
            <div className="organizations-label">{org.name}</div>
          </div>
        );
      });

    return universities.length > 0 ? (
      universities
    ) : (
      <div className="i">No companies found</div>
    );
  };

  return (
    organizations && (
      <div className="page-container" style={{ padding: 0 }}>
        <div className="organizations-container">
          <h3 className="organizations-header">Organizations</h3>
          <div className="organizations-subheader">
            Users have the choice to register with either a personal email or
            organization (work or university) email.
            <br />
            <br />
            Those that choose to register with their organization-based email
            have the ability to verify their organization via a confirmation
            code sent to them as only verified organization-based users can view
            listings and message other users within the same organization.
            <br />
            <br />
            The following are organizations where organization-based
            verification is available (more to come soon!):
          </div>

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
              style={{ width: "50%" }}
            >
              Company
            </ToggleButton>
            <ToggleButton
              value={OrganizationType.UNIVERSITY}
              style={{ width: "50%" }}
            >
              University
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Search for organization"
            name="organization"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            margin="dense"
            autoComplete="off"
          />

          {orgCategory === OrganizationType.COMPANY && (
            <>
              <h4>Companies</h4>
              {renderCompanies(organizations)}
            </>
          )}

          {orgCategory === OrganizationType.UNIVERSITY && (
            <>
              <h4>Universities</h4>
              {renderUniversities(organizations)}
            </>
          )}
        </div>
      </div>
    )
  );
};

export default Organizations;
