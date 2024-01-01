import {
  Organization,
  OrganizationType
} from "@components/Validate/organizations";
import React from "react";

const Organizations = () => {
  return (
    <div className="page-container" style={{ padding: 0 }}>
      <div className="organizations-container">
        <h3 className="organizations-header">Organizations</h3>
        <div className="organizations-subheader">
          Users have the choice to register with either a personal email or
          organization (work or university) email.
          <br />
          <br />
          Those that choose to register with their organization-based email have
          the ability to verify their organization via a confirmation code sent
          to them as only verified organization-based users can view listings
          and message other users within the same organization.
          <br />
          <br />
          The following are organizations where organization-based verification
          is available (more to come soon!):
        </div>

        <h4>Companies</h4>

        {Object.values(Organization)
          .filter(org => org.type === OrganizationType.COMPANY)
          .map(org => {
            return (
              <div className="organizations-organization">
                <img
                  alt={org.name}
                  src={org.logoSrc}
                  className="organization-logo"
                />
                <div className="organizations-label">{org.name}</div>
              </div>
            );
          })}

        <h4>Universities</h4>

        {Object.values(Organization)
          .filter(org => org.type === OrganizationType.UNIVERSITY)
          .map(org => {
            return (
              <div className="organizations-organization">
                <img
                  alt={org.name}
                  src={org.logoSrc}
                  className="organization-logo"
                />
                <div className="organizations-label">{org.name}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Organizations;
