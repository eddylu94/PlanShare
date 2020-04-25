import React from "react";
import { Link } from "react-router-dom";

import { ISubscriptionData, getDaysAgoString } from "../../utils/utils";

interface ISearchSubscriptionCardProps {
  subscription: ISubscriptionData;
  isMobile: boolean;
  isProfile?: boolean;
  handleSubscriptionCardClick?: (subscriptionId: string) => void;
}

const SearchSubscriptionCard = (props: ISearchSubscriptionCardProps) => {
  const {
    subscription,
    isMobile,
    isProfile,
    handleSubscriptionCardClick
  } = props;

  const {
    _id,
    subscriptionBrand,
    listingDescription,
    firstName,
    createdDate,
    price,
    numberOfPeople,
    userId
  } = subscription;

  const renderSubscriptionLogo = () => (
    <img
      alt="Subscription logo"
      className="subscription-card-subscription-logo"
      src={subscriptionBrand.logo}
    />
  );

  const renderSubsciptionCardAuthor = () => (
    <div className="subscription-card-author">
      <div>
        {!isProfile ? (
          <>
            Posted by{" "}
            <Link to={`profile?id=${userId}`}>
              <span className="subscription-card-first-name">{firstName}</span>{" "}
            </Link>
          </>
        ) : null}
        {/* at {organization.name} */}
      </div>
      {/* <img
        alt="Organization logo"
        className="subscription-card-organization-logo"
        src={organization.logo}
      /> */}
    </div>
  );

  const renderSubscriptionInfo = () => (
    <div className="subscription-card-info">
      <div className="subscription-card-info-name">
        {subscriptionBrand.name}
      </div>
      <div className="subscription-card-description-container">
        <div className="subscription-card-description">
          <span>{listingDescription}</span>
        </div>
      </div>
      {!isMobile && !isProfile ? renderSubsciptionCardAuthor() : null}
    </div>
  );

  const renderSubscriptionBasicInfo = () => (
    <div className="subscription-card-basic-info">
      <div className="subscription-card-date">
        {getDaysAgoString(new Date(createdDate))}
      </div>
      <div className="subscription-card-basic-info-detail">
        ${price.toFixed(2)}
      </div>
      <div className="subscription-card-basic-info-detail">
        <img
          alt="Number of people"
          className="subscription-card-people-icon"
          src="/people_icon.png"
        />
        {numberOfPeople}
      </div>
    </div>
  );

  return (
    <div
      className="subscription-card"
      tabIndex={0}
      onClick={() =>
        handleSubscriptionCardClick ? handleSubscriptionCardClick(_id) : {}
      }
    >
      <div
        className="subscription-card-logo-and-info"
        style={{ marginBottom: isProfile ? 10 : 0 }}
      >
        {renderSubscriptionLogo()}
        {renderSubscriptionInfo()}
      </div>
      {isMobile && !isProfile ? renderSubsciptionCardAuthor() : null}
      {renderSubscriptionBasicInfo()}
    </div>
  );
};

export default SearchSubscriptionCard;
