import React from "react";

import SearchSubscriptionCard from "./../Search/search-subscription-card";
import {
  IProfileOrganizationData,
  ISubscriptionData
} from "./../../utils/utils";
import { DEVICE_MODE } from "./../../utils/constants";

import useMediaQuery from "@material-ui/core/useMediaQuery";

interface IProfileCanvasProps {
  firstName: string;
  organizations: IProfileOrganizationData[];
  joinedDate: number;
  authoredSubscriptions: ISubscriptionData[];
}

const ProfileCanvas = (props: IProfileCanvasProps) => {
  const { firstName, organizations, joinedDate, authoredSubscriptions } = props;

  const renderOrganization = (
    profileOrganizationData: IProfileOrganizationData,
    index: number
  ) => {
    const {
      // email,
      organization
    } = profileOrganizationData;

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
        {/* <div className="profile-organization-email">({email})</div> */}
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

  const small = useMediaQuery("(max-width:768px)");
  const medium = useMediaQuery("(min-width:768px)");
  const large = useMediaQuery("(min-width:992px)");

  let deviceMode: string;
  if (small) {
    deviceMode = DEVICE_MODE.MOBILE;
  } else if (medium && !large) {
    deviceMode = DEVICE_MODE.TABLET;
  } else {
    deviceMode = DEVICE_MODE.DESKTOP;
  }

  const subscriptionCards = authoredSubscriptions.map((subscription, i) => {
    return (
      <SearchSubscriptionCard
        key={"subscription-card-" + i}
        subscription={subscription}
        isMobile={deviceMode === DEVICE_MODE.MOBILE}
        isProfile={true}
      />
    );
  });

  return (
    <div className="page-container">
      <div className="profile-container">
        <div className="profile-wrapper">
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
      <h3 className="profile-authored-subscriptions-header">
        Listed subscriptions
      </h3>
      <div className="profile-authored-subscriptions">{subscriptionCards}</div>
    </div>
  );
};

export default ProfileCanvas;
