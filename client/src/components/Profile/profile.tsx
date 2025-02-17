// Third-party libraries
import React, { useState, useEffect, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { History } from "history";

// Components
import SearchSubscriptionCard from "@components/Search/search-subscription-card";
import Subscription from "@components/Subscription/subscription";

// API
import {
  getArchivedSubscriptions,
  getProfile,
  getSubscriptionsByAuthor
} from "@requests/getRequests";
import {
  archiveSubscription,
  deleteSubscription
} from "@requests/postRequests";

// Utilities
import { UserDataContext } from "user-context-provider";
import { ClickEvent } from "@utils/interfaces";
import { log, ISubscriptionData, useDeviceMode } from "@utils/utils";
import { STATUS_CODE, STATUS_MESSAGE, DEVICE_MODE } from "@utils/constants";

const ProfileProvider = (props: { history: History; location: any }) => {
  const { history, location } = props;

  const _userData = useContext(UserDataContext);

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  log(_userData);

  const params = new URLSearchParams(location.search);
  const profileUserId = params.get("id");

  const deviceMode = useDeviceMode();

  // Whether at least one request has been executed for profile
  const [isRetrievedProfileDirty, setIsRetrievedProfileDirty] = useState(false);

  const [selectedSubscription, setSelectedSubscription] = useState("");

  const [firstName, setFirstName] = useState("");
  const [joinedDate, setJoinedDate] = useState(-1);

  const [authoredSubscriptions, setAuthoredSubscriptions] = useState(
    [] as Array<ISubscriptionData>
  );

  const [archivedSubscriptions, setArchivedSubscriptions] = useState(
    [] as Array<ISubscriptionData>
  );

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
      setJoinedDate(profileData.joinedDate);
      setIsRetrievedProfileDirty(true);
    }
  };

  const retrieveProfile = () => {
    const query = [] as any[];
    if (profileUserId) {
      query.push({ profileUserId });
    }

    getProfile(
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

    getSubscriptionsByAuthor(
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

  const archiveSubscriptionHandler = (_e: ClickEvent, id: string) => {
    archiveSubscription(
      id,
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

  const deleteSubscriptionHandler = (_e: ClickEvent, id: string) => {
    deleteSubscription(
      id,
      handleDeleteSubscriptionResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const retrieveArchivedSubscriptions = () => {
    getArchivedSubscriptions(
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

  const subscriptionCards = authoredSubscriptions.map((subscription, i) => {
    return (
      <SearchSubscriptionCard
        archiveSubscription={archiveSubscriptionHandler}
        deleteSubscription={deleteSubscriptionHandler}
        key={"subscription-card-" + i}
        subscription={subscription}
        isMobile={deviceMode === DEVICE_MODE.MOBILE}
        isProfile
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
          archiveSubscription={archiveSubscriptionHandler}
          deleteSubscription={deleteSubscriptionHandler}
          key={"subscription-card-" + i}
          subscription={subscription}
          isMobile={deviceMode === DEVICE_MODE.MOBILE}
          isProfile
          isDisplayButtons={!isDifferentUser}
          isArchived
          handleSubscriptionCardClick={handleSubscriptionCardClick}
        />
      );
    });

  const profileSubscriptions = (
    <>
      <h3 className="profile-authored-subscriptions-header">
        Listed subscriptions
      </h3>
      {subscriptionCards && subscriptionCards.length > 0 ? (
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
      {archivedSubscriptionCards && archivedSubscriptionCards.length > 0 ? (
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

  const date = new Date(joinedDate);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit"
  };
  const formattedJoinedDate = date.toLocaleDateString("en-US", options);

  return isRetrievedProfileDirty ? (
    <div className="page-container" style={{ alignItems: "center" }}>
      <div className="page-wrapper">
        {selectedSubscription && (
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
        )}
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
                  <Link to={`messages?id=${profileUserId}`}>
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
            <div className="profile-detail-container">
              <div className="profile-detail-header">Member since:</div>
              <div
                className="profile-joined-date-value profile-detail-name"
                style={{ marginLeft: 0 }}
              >
                {formattedJoinedDate}
              </div>
            </div>
          </div>
        </div>
        {profileSubscriptions}
        {!profileUserId || currentUserId === profileUserId
          ? profileArchivedSubscriptions
          : null}
      </div>
    </div>
  ) : null;
};

export default withRouter(ProfileProvider);
