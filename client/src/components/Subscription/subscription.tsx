import React, { useState, useEffect } from "react";

import { IUserContext, UserDataContext } from "../../user-context-provider";
import { baseGetRequest } from "../../base-requests";
import { log } from "../../utils/utils";
import { Link } from "react-router-dom";
import moment from "moment";

const SubscriptionProviderWithContext = (props: {
  userData: IUserContext;
  subscriptionId: string;
}) => {
  const _userData = props.userData;

  const { subscriptionId } = props;

  const [subscriptionData, setSubscriptionData] = useState(null as any);

  const retrieveSubscriptionResponseHandler = (data: any) => {
    log(data);

    const newSubscriptionData = data?.body?.subscriptionData;
    if (newSubscriptionData) {
      log(newSubscriptionData);
      setSubscriptionData(newSubscriptionData);
    }
  };

  const retrieveSubscription = () => {
    baseGetRequest(
      _userData.user?.auth ? "getsubscription" : "getsubscriptionasguest",
      [{ subscriptionId }],
      retrieveSubscriptionResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    if (subscriptionId && subscriptionId !== "guest") {
      retrieveSubscription();
    }
    // eslint-disable-next-line
  }, [subscriptionId]);

  const userData = _userData;
  const isGuest = !!(subscriptionId && subscriptionId === "guest");
  const currentUser = _userData.user?.userId as string;

  if (isGuest) {
    return (
      <div className="subscription-guest-login-message">
        <div className="subscription-guest-login-message-wrapper">
          <span>
            The selected listing is only visible for members of the same
            organization.
            <br />
            <br />
            Please <Link to="/login">log in</Link> or{" "}
            <Link to="/signup">sign up</Link> to view listing details within an
            organization
          </span>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  const {
    subscriptionBrand,
    listingDescription,
    firstName,
    numberOfPeople,
    createdDate,
    price,
    subscriptionUrl,
    userId,
    otherSubscription,
    contactFb,
    contactEmail,
    organization
  } = subscriptionData;

  const name =
    subscriptionBrand.type === "OTHER"
      ? otherSubscription
      : subscriptionBrand.name;

  return (
    <div className="subscription-wrapper">
      <div className="subscription-header">
        <img
          alt="Subscription logo"
          className="subscription-card-subscription-logo"
          src={subscriptionBrand.logo}
        />
        <div
          className="subscription-card-name subscription-detail-cropped"
          style={{
            fontSize: 18,
            fontWeight: 600
          }}
        >
          {name}
        </div>
      </div>
      <div className="subscription-detail subscription-subscription-detail">
        Posted by{" "}
        <Link to={`profile?id=${userId}`}>
          <span className="subscription-first-name">{firstName}</span>
        </Link>
      </div>
      <div className="subscription-detail subscription-subscription-author-detail">
        <span className="b">{organization ? organization.name : "Public"}</span>
        <img
          alt="Organization logo"
          className="subscription-card-organization-logo"
          src={organization ? organization.logo : "/icon.png"}
        />
      </div>
      <div className="subscription-detail subscription-subscription-detail">
        <span className="subscription-detail-date">
          {moment(createdDate).format("MMM. D, YYYY h:mm a")}
        </span>
      </div>

      {userId && userId !== currentUser ? (
        <>
          <div className="subscription-detail" style={{ marginTop: 15 }}>
            <Link
              to={!userData.user?.userId ? "signup" : `messages?id=${userId}`}
            >
              <button className="subscription-message-button">
                <span className="b subscription-message-label">{`Message ${firstName}`}</span>
                <img
                  alt="Posted date"
                  className="subscription-message-icon"
                  src="/send_icon_white.png"
                />
              </button>
            </Link>
          </div>
        </>
      ) : null}

      {contactFb || contactEmail ? (
        <div style={{ marginTop: 20 }}>
          {contactFb ? (
            <div className="subscription-detail subscription-subscription-detail">
              <img
                alt="Facebook"
                className="subscription-detail-icon"
                style={{ opacity: 1 }}
                src="/fb_logo.png"
              />
              {contactFb}
            </div>
          ) : null}

          {contactEmail ? (
            <div className="subscription-detail subscription-subscription-detail">
              <img
                alt="Email"
                className="subscription-detail-icon"
                src="/email_icon.png"
              />
              {contactEmail}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="subscription-label">Details</div>
      <div className="subscription-detail subscription-subscription-detail">
        <img
          alt="Number of people"
          className="subscription-detail-icon"
          src="/people_icon.png"
        />
        <span className="subscription-detail-bold">
          {`${numberOfPeople} ${numberOfPeople === 1 ? "person" : "people"}`}
        </span>
        needed
      </div>
      <div className="subscription-detail subscription-subscription-detail">
        <img
          alt="Price per person"
          className="subscription-detail-icon"
          src="/exchange_icon.png"
        />
        <span className="subscription-detail-bold">${price.toFixed(2)}</span>{" "}
        <span>per person</span>
      </div>
      <div className="subscription-label">Description</div>
      <div className="subscription-detail">
        <div className="subscription-card-description">
          {listingDescription}
        </div>
      </div>

      <div className="subscription-label">Link to subscription</div>
      <div className="subscription-detail">
        {subscriptionUrl ? (
          <a href={subscriptionUrl} target="_blank" rel="noopener noreferrer">
            {subscriptionUrl}
          </a>
        ) : (
          "---"
        )}
      </div>
    </div>
  );
};

const SubscriptionProvider = (props: { subscriptionId: string }) => (
  <UserDataContext.Consumer>
    {userData => (
      <SubscriptionProviderWithContext
        userData={userData}
        subscriptionId={props.subscriptionId}
      />
    )}
  </UserDataContext.Consumer>
);

export default SubscriptionProvider;
