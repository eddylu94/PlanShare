import React from "react";
import { Link } from "react-router-dom";

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
  isDifferentUser: boolean;
  currentUserId: string;
  otherUserId: string;
  archiveSubscription: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
  archivedSubscriptions?: ISubscriptionData[];
}

const ProfileCanvas = (props: IProfileCanvasProps) => {
  const {
    firstName,
    organizations,
    joinedDate,
    authoredSubscriptions,
    archivedSubscriptions,
    isDifferentUser,
    currentUserId,
    otherUserId,
    archiveSubscription
  } = props;

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
  const xLarge = useMediaQuery("(min-width:1200px)");

  let deviceMode: string;
  if (small) {
    deviceMode = DEVICE_MODE.MOBILE;
  } else if (medium && !large) {
    deviceMode = DEVICE_MODE.TABLET;
  } else if (large && !xLarge) {
    deviceMode = DEVICE_MODE.DESKTOP;
  } else {
    deviceMode = DEVICE_MODE.LARGE_DESKTOP;
  }

  const subscriptionCards = authoredSubscriptions.map((subscription, i) => {
    return (
      <SearchSubscriptionCard
        archiveSubscription={archiveSubscription}
        key={"subscription-card-" + i}
        subscription={subscription}
        isMobile={deviceMode === DEVICE_MODE.MOBILE}
        isProfile={true}
        isDisplayButtons={!isDifferentUser}
      />
    );
  });

  const archivedSubscriptionCards =
    archivedSubscriptions &&
    archivedSubscriptions.map((subscription, i) => {
      return (
        <SearchSubscriptionCard
          archiveSubscription={archiveSubscription}
          key={"subscription-card-" + i}
          subscription={subscription}
          isMobile={deviceMode === DEVICE_MODE.MOBILE}
          isProfile={true}
          isDisplayButtons={!isDifferentUser}
          isArchived={true}
        />
      );
    });

  const profileSubscriptions = (
    <>
      <h3 className="profile-authored-subscriptions-header">
        Listed subscriptions
      </h3>
      {subscriptionCards && subscriptionCards.length ? (
        <div className="profile-authored-subscriptions">
          {subscriptionCards}
        </div>
      ) : (
        <div className="search-no-results">
          No currently active subscriptions
        </div>
      )}
    </>
  );

  const profileArchivedSubscriptions = (
    <>
      <h3 className="profile-authored-subscriptions-header">
        Archived subscriptions
      </h3>
      {archivedSubscriptionCards && archivedSubscriptionCards.length ? (
        <div className="profile-authored-subscriptions">
          {archivedSubscriptionCards}
        </div>
      ) : (
        <div className="search-no-results">
          No currently archived subscriptions
        </div>
      )}
    </>
  );

  return (
    <div className="page-container">
      <div className="profile-container">
        {isDifferentUser ? (
          <div>
            <Link to={`messages?id=${otherUserId}`}>
              <button className="profile-message-button">
                Message
                <img
                  alt="Posted date"
                  className="profile-message-icon"
                  src="/send_icon_white.png"
                />
              </button>
            </Link>
          </div>
        ) : null}
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
      {profileSubscriptions}
      {!otherUserId || currentUserId === otherUserId
        ? profileArchivedSubscriptions
        : null}
    </div>
  );
};

export default ProfileCanvas;
