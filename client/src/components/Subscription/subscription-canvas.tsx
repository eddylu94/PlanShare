import React from "react";

import moment from "moment";

import { ISubscriptionData } from "./../../utils/utils";

interface ISubscriptionCanvasProps {
  subscriptionData: ISubscriptionData;
}

const SubscriptionCanvas = (props: ISubscriptionCanvasProps) => {
  const { subscriptionData } = props;

  if (!subscriptionData) {
    return null;
  }

  const {
    subscriptionBrand,
    listingDescription,
    organization,
    firstName,
    numberOfPeople,
    createdDate,
    price,
    subscriptionUrl
  } = subscriptionData;

  return (
    <div>
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
          {subscriptionBrand.name}
        </div>
      </div>
      <div className="subscription-detail subscription-subscription-detail">
        Posted by <span className="subscription-first-name">{firstName}</span>
      </div>
      <div className="subscription-detail subscription-subscription-detail">
        <img
          alt="Posted date"
          className="subscription-detail-icon"
          src="/time_icon.png"
        />
        {moment(createdDate).format("MMM. D, YYYY h:mm a")}
      </div>
      <div className="subscription-label">Subscription</div>
      <div className="subscription-detail subscription-subscription-detail">
        <img
          alt="Number of people"
          className="subscription-detail-icon"
          src="/people_icon.png"
        />
        <span className="subscription-detail-bold">
          {numberOfPeople} people
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
      <div className="subscription-label">Subscription URL</div>
      <div className="subscription-detail">
        <a href={subscriptionUrl} target="_blank" rel="noopener noreferrer">
          {subscriptionUrl}
        </a>
      </div>
      <div className="subscription-label">Description</div>
      <div className="subscription-detail">
        <div className="subscription-card-description">
          {listingDescription}
        </div>
      </div>
      <div className="subscription-label">Organization</div>
      <div className="subscription-detail">
        <div>{organization.name}</div>
        <img
          alt="Organization logo"
          className="subscription-card-organization-logo"
          src={organization.logo}
        />
      </div>
    </div>
  );
};

export default SubscriptionCanvas;
