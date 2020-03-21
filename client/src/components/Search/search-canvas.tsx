import React from "react";

interface IOrganizationSelection {
  domain: string;
  name: string;
}

interface ISubscription {
  name: string;
  type: string;
  logo: string;
}

export interface ISubscriptionData {
  _id: string;
  subscriptionTypeSelection: string;
  subscriptionBrand: ISubscription;
  subscriptionUrl: string;
  listingDescription: string;
  numberOfPeople: number;
  price: number;
  organizationSelection: IOrganizationSelection;
  userId: string;
}

interface ISearchCanvasProps {
  subscriptionData: ISubscriptionData[];
}

const SubscriptionCard = (props: { subscription: ISubscriptionData }) => {
  const { subscription } = props;

  const { subscriptionBrand, listingDescription } = subscription;

  return (
    <div className="subscription-card">
      <img
        alt="Subscription logo"
        className="subscription-card-subscription-logo"
        src={subscriptionBrand.logo}
      />
      <div className="subscription-card-info">
        <div className="subscription-card-info-name">
          {subscriptionBrand.name}
        </div>
        <div>{listingDescription}</div>
      </div>
    </div>
  );
};

const SearchCanvas = (props: ISearchCanvasProps) => {
  const { subscriptionData } = props;

  const subscriptionCards = subscriptionData.map((subscription, i) => {
    return (
      <SubscriptionCard
        key={"subscription-card-" + i}
        subscription={subscription}
      />
    );
  });

  return (
    <div className="page-container">
      <div className="search-bar">
        <input
          type="text"
          className="search-text-input"
          placeholder="Search for a subscription"
        />
        <button className="search-submit-button">
          <img alt="Search" className="search-icon" src="/search_icon.png" />
        </button>
      </div>
      {subscriptionCards}
    </div>
  );
};

export default SearchCanvas;
