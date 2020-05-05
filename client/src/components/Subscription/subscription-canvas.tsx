import React from "react";
import { Link } from "react-router-dom";

import moment from "moment";

import { ISubscriptionData } from "./../../utils/utils";

interface ISubscriptionCanvasProps {
  subscriptionData: ISubscriptionData;
  currentUser: string;
  isGuest?: boolean;
}

const SubscriptionCanvas = (props: ISubscriptionCanvasProps) => {
  const { subscriptionData, currentUser, isGuest } = props;

  if (isGuest) {
    return (
      <div className="subscription-guest-login-message">
        Please log in to view subscription details
        <div className="subscription-guest-login-message-link-wrapper">
          <Link to="/login">
            <button className="subscription-guest-login-button">Login</button>
          </Link>
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
    otherSubscription
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
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: 20,
            fontSize: 18,
            fontWeight: 600,
            alignItems: "center"
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
      <div className="subscription-detail subscription-subscription-detail">
        <span className="subscription-detail-date">
          {moment(createdDate).format("MMM. D, YYYY h:mm a")}
        </span>
      </div>

      {userId && userId !== currentUser ? (
        <>
          <div className="subscription-detail" style={{ marginTop: 15 }}>
            <Link to={`messages?id=${userId}`}>
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

      <div className="subscription-label">Subscription</div>
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
        per person
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
      {/* <div className="subscription-label">Organization</div>
      <div className="subscription-detail">
        <div>{organization.name}</div>
        <img
          alt="Organization logo"
          className="subscription-card-organization-logo"
          src={organization.logo}
        />
      </div> */}
    </div>
  );
};

export default SubscriptionCanvas;
