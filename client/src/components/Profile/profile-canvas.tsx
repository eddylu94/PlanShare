import React from "react";
import { Link } from "react-router-dom";

import SearchSubscriptionCard from "./../Search/search-subscription-card";
import Subscription from "./../Subscription/subscription-provider";
import { ISubscriptionData, IOrganization } from "./../../utils/utils";
import { DEVICE_MODE } from "./../../utils/constants";

import useMediaQuery from "@material-ui/core/useMediaQuery";

interface IProfileCanvasProps {
  selectedSubscription: string;
  username: string;
  organization: IOrganization;
  joinedDate: number;
  authoredSubscriptions: ISubscriptionData[];
  isDifferentUser: boolean;
  currentUserId: string;
  otherUserId: string;
  closeModal: () => void;
  handleSubscriptionCardClick: (subscriptionId: string) => void;
  archiveSubscription: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
  deleteSubscription: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
  archivedSubscriptions?: ISubscriptionData[];
}

const ProfileCanvas = (props: IProfileCanvasProps) => {
  const {
    selectedSubscription,
    username,
    organization,
    joinedDate,
    authoredSubscriptions,
    archivedSubscriptions,
    isDifferentUser,
    currentUserId,
    otherUserId,
    closeModal,
    handleSubscriptionCardClick,
    archiveSubscription,
    deleteSubscription
  } = props;

  const renderOrganization = () => {
    return (
      <div className="profile-detail-container">
        <div className="profile-detail-header">Member of:</div>
        <div className="profile-organization">
          <img
            alt="Organization logo"
            className="profile-organization-logo"
            src={organization.logo}
          />
          <div className="profile-detail-name">{organization.name}</div>
        </div>
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
        deleteSubscription={deleteSubscription}
        key={"subscription-card-" + i}
        subscription={subscription}
        isMobile={deviceMode === DEVICE_MODE.MOBILE}
        isProfile={true}
        isDisplayButtons={!isDifferentUser}
        handleSubscriptionCardClick={handleSubscriptionCardClick}
      />
    );
  });

  const archivedSubscriptionCards =
    archivedSubscriptions &&
    archivedSubscriptions.map((subscription, i) => {
      return (
        <SearchSubscriptionCard
          archiveSubscription={archiveSubscription}
          deleteSubscription={deleteSubscription}
          key={"subscription-card-" + i}
          subscription={subscription}
          isMobile={deviceMode === DEVICE_MODE.MOBILE}
          isProfile={true}
          isDisplayButtons={!isDifferentUser}
          isArchived={true}
          handleSubscriptionCardClick={handleSubscriptionCardClick}
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
    <div className="page-container" style={{ alignItems: "center" }}>
      <div className="page-wrapper">
        {selectedSubscription ? (
          <>
            <div className="overlay" onClick={closeModal}></div>
            <div className="search-modal-container">
              <div className="search-modal">
                <button className="close-button" onClick={closeModal}>
                  <img
                    alt="Close"
                    className="close-icon"
                    src="/close_icon.png"
                  />
                </button>
                <Subscription subscriptionId={selectedSubscription} />
              </div>
            </div>
          </>
        ) : null}
        <div className="profile-container">
          <div className="profile-wrapper">
            <div className="profile-header">
              <img
                alt="Profile"
                className="profile-profile-picture"
                src="/profile_picture_placeholder.png"
              />
              <div className="profile-name-and-joined-date">
                <div className="profile-first-name">{username}</div>
              </div>
            </div>
            {isDifferentUser ? (
              <div className="profile-detail-container">
                <div className="profile-detail-header">Contact:</div>
                <div className="profile-message-link-wrapper">
                  <Link to={`messages?id=${otherUserId}`}>
                    <button className="profile-message-button">
                      {`Message ${username}`}
                      <img
                        alt="Posted date"
                        className="profile-message-icon"
                        src="/send_icon_white.png"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            ) : null}
            {organization ? renderOrganization() : null}
            <div className="profile-detail-container">
              <div className="profile-detail-header">Member since:</div>
              <div
                className="profile-joined-date-value profile-detail-name"
                style={{ marginLeft: 0 }}
              >
                {new Date(joinedDate).toDateString()}
              </div>
            </div>
          </div>
        </div>
        {profileSubscriptions}
        {!otherUserId || currentUserId === otherUserId
          ? profileArchivedSubscriptions
          : null}
      </div>
    </div>
  );
};

export default ProfileCanvas;
