import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { IUserContext, UserDataContext } from "../../user-context-provider";
import { baseGetRequest, basePostRequest } from "../../base-requests";
import {
  log,
  ISubscriptionData,
  IOrganization,
  useDeviceMode
} from "../../utils/utils";
import {
  STATUS_CODE,
  STATUS_MESSAGE,
  DEVICE_MODE
} from "../../utils/constants";
import { Link } from "react-router-dom";

import SearchSubscriptionCard from "../Search/search-subscription-card";
import Subscription from "../Subscription/subscription";

const ProfileProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
  location: Location;
}) => {
  const _userData = props.userData;

  // Whether at least one request has been executed for profile
  const [isRetrievedProfileDirty, setIsRetrievedProfileDirty] = useState(false);

  const { history, location } = props;

  var params = new URLSearchParams(location.search);
  const profileUserId = params.get("id");

  const [selectedSubscription, setSelectedSubscription] = useState("");

  const [firstName, setFirstName] = useState("");
  const [organization, setOrganization] = useState({} as IOrganization);
  const [joinedDate, setJoinedDate] = useState(-1);

  const [authoredSubscriptions, setAuthoredSubscriptions] = useState(
    [] as ISubscriptionData[]
  );

  const [archivedSubscriptions, setArchivedSubscriptions] = useState(
    [] as ISubscriptionData[]
  );

  const deviceMode = useDeviceMode();

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  log(_userData);

  const closeModal = () => {
    setSelectedSubscription("");
  };

  const handleSubscriptionCardClick = (subscriptionId: string) => {
    setSelectedSubscription(subscriptionId);
  };

  const retrieveProfileResponseHandler = (data: any) => {
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      log("User not validated");
      history.push("/validate");
    }

    const profileData = data?.body?.profileData;
    if (profileData) {
      log(profileData);

      setFirstName(profileData.firstName);
      setOrganization(profileData.organization);
      setJoinedDate(profileData.joinedDate);
      setIsRetrievedProfileDirty(true);
    }
  };

  const retrieveProfile = () => {
    const query = [] as any[];
    if (profileUserId) {
      query.push({ profileUserId });
    }

    baseGetRequest(
      "getprofile",
      query,
      retrieveProfileResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const retrieveSubscriptionsByUserResponseHandler = (data: any) => {
    const authoredSubscriptions = data?.body?.subscriptions;
    if (authoredSubscriptions) {
      log(authoredSubscriptions);
      setAuthoredSubscriptions(authoredSubscriptions);
    }
  };

  const retrieveArchivedSubscriptionsResponseHandler = (data: any) => {
    const newArchivedSubscriptions = data?.body?.subscriptions;
    if (newArchivedSubscriptions) {
      log(newArchivedSubscriptions);
      setArchivedSubscriptions(newArchivedSubscriptions);
    }
  };

  const retrieveSubscriptionsByUser = () => {
    const query = [] as any[];
    if (profileUserId) {
      query.push({ profileUserId });
    }

    baseGetRequest(
      "getsubscriptionsbyauthor",
      query,
      retrieveSubscriptionsByUserResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const handleArchiveSubscriptionResponseHandler = (data: any) => {
    log(data);
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      retrieveSubscriptionsByUser();
      retrieveArchivedSubscriptions();
      alert(
        "The listing has been archived. Only you are be able to view your archived listings"
      );
    }
  };

  const archiveSubscription = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    const postRequestData = {
      subscriptionId: id
    };
    basePostRequest(
      "archivesubscription",
      postRequestData,
      handleArchiveSubscriptionResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const handleDeleteSubscriptionResponseHandler = (data: any) => {
    log(data);
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      retrieveSubscriptionsByUser();
      retrieveArchivedSubscriptions();
      alert("The listing has been deleted.");
    }
  };

  const deleteSubscription = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    const postRequestData = {
      subscriptionId: id
    };
    basePostRequest(
      "deletesubscription",
      postRequestData,
      handleDeleteSubscriptionResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const retrieveArchivedSubscriptions = () => {
    baseGetRequest(
      "getarchivedsubscriptions",
      [],
      retrieveArchivedSubscriptionsResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveProfile();
    retrieveSubscriptionsByUser();

    if (!profileUserId || _userData.user?.userId === profileUserId) {
      retrieveArchivedSubscriptions();
    }
    // eslint-disable-next-line
  }, [profileUserId]);

  useEffect(() => {
    retrieveProfile();
    retrieveSubscriptionsByUser();
    // eslint-disable-next-line
  }, []);

  const currentUserId = _userData.user?.userId as string;
  const isDifferentUser = !!(
    profileUserId && profileUserId !== (_userData.user?.userId as string)
  );
  const otherUserId = profileUserId as string;

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

  return isRetrievedProfileDirty ? (
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
                <div className="profile-first-name">{firstName}</div>
              </div>
            </div>
            {isDifferentUser ? (
              <div className="profile-detail-container">
                <div className="profile-detail-header">Contact:</div>
                <div className="profile-message-link-wrapper">
                  <Link to={`messages?id=${otherUserId}`}>
                    <button className="profile-message-button">
                      {`Message ${firstName}`}
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
  ) : null;
};

const ProfileProvider = (props: { history: History; location: any }) => (
  <UserDataContext.Consumer>
    {userData => (
      <ProfileProviderWithContext
        userData={userData}
        history={props.history}
        location={props.location}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(ProfileProvider);
