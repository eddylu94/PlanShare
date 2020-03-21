import React from "react";

import { IProfileOrganizationData } from "./../../utils/utils";

interface IProfileCanvasProps {
  firstName: string;
  organizations: IProfileOrganizationData[];
  joinedDate: number;
}

const ProfileCanvas = (props: IProfileCanvasProps) => {
  const { firstName, organizations, joinedDate } = props;

  const renderOrganization = (
    profileOrganizationData: IProfileOrganizationData,
    index: number
  ) => {
    const { email, organization } = profileOrganizationData;

    return (
      <div
        key={"profile-organization-" + index}
        className="profile-organization"
      >
        <img
          alt="Organization logo"
          className="profile-organization-logo"
          src={organization.logo}
        />
        <div className="profile-organization-name">{organization.name}</div>
        <div className="profile-organization-email">({email})</div>
      </div>
    );
  };

  const renderOrganizations = () => {
    const list = organizations.map((organization, i) =>
      renderOrganization(organization, i)
    );
    return (
      <div className="profile-organizations">
        <div className="profile-organizations-header">Member of:</div>
        {list}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="profile-container">
        <div className="profile-header">
          <img
            alt="Profile"
            className="profile-profile-picture"
            src="/profile_picture_placeholder.png"
          />
          <div className="profile-name-and-joined-date">
            <div className="profile-first-name">{firstName}</div>
            <div className="profile-joined-date">
              Member since:
              <span className="profile-joined-date-value">
                {new Date(joinedDate).toDateString()}
              </span>
            </div>
          </div>
        </div>
        {renderOrganizations()}
      </div>
    </div>
  );
};

export default ProfileCanvas;
