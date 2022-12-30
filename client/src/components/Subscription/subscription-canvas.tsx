import React from "react";
import { Link } from "react-router-dom";

import moment from "moment";

import { ISubscriptionData } from "./../../utils/utils";
import { IUserContext } from "../../user-context-provider";

interface ISubscriptionCanvasProps {
  userData: IUserContext;
  subscriptionData: ISubscriptionData;
  currentUser: string;
}

const SubscriptionCanvas = (props: ISubscriptionCanvasProps) => {
  const { userData, subscriptionData, currentUser } = props;

  if (!subscriptionData) {
    return null;
  }

  const {
    subscriptionBrand,
    listingDescription,
    username,
    numberOfPeople,
    createdDate,
    price,
    subscriptionUrl,
    userId,
    otherSubscription,
    contactFb,
    contactEmail
  } = subscriptionData;

  let name =
    subscriptionBrand.type === "OTHER"
      ? otherSubscription
      : subscriptionBrand.name;

  let logo = subscriptionBrand.logo;

  return (
    <div className="subscription-wrapper">
      <div className="subscription-header">
        <img
          alt="Subscription logo"
          className="subscription-card-subscription-logo"
          src={logo}
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
          <span className="subscription-first-name">{username}</span>
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
            <Link
              to={!userData.user?.userId ? "signup" : `messages?id=${userId}`}
            >
              <button className="subscription-message-button">
                <span className="b subscription-message-label">{`Message ${username}`}</span>
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

      <div className="subscription-label">Link to item</div>
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

export default SubscriptionCanvas;
