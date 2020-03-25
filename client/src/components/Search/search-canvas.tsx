import React from "react";
import { IOrganization } from "../../utils/utils";

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
  userId: string;
  firstName: string;
  organization: IOrganization;
  createdDate: string;
}

interface ISearchCanvasProps {
  subscriptionData: ISubscriptionData[];
}

const SubscriptionCard = (props: { subscription: ISubscriptionData }) => {
  const { subscription } = props;

  const {
    subscriptionBrand,
    listingDescription,
    firstName,
    organization,
    createdDate
  } = subscription;

  const getDaysAgoString = (d: Date) => {
    const differenceInMilliseconds = new Date().getTime() - d.getTime();

    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / 1000 / 60
    );

    if (differenceInMinutes === 0) {
      return "Just posted";
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min ago`;
    } else {
      const differenceInHours = Math.floor(differenceInMinutes / 60);

      if (differenceInHours === 1) {
        return "1 hour ago";
      } else if (differenceInHours < 24) {
        return `${differenceInHours} hours ago`;
      } else {
        const differenceInDays = Math.floor(differenceInHours / 24);

        if (differenceInDays === 1) {
          return "1 day ago";
        } else {
          return `${differenceInDays} days ago`;
        }
      }
    }
  };

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
        <div className="subscription-card-description">
          {listingDescription}
        </div>
        <div className="subscription-card-author">
          <div>
            Posted by{" "}
            <span className="subscription-card-first-name">{firstName}</span> at{" "}
            {organization.name}
          </div>
          <img
            alt="Organization logo"
            className="subscription-card-organization-logo"
            src={organization.logo}
          />
        </div>
      </div>
      <div className="subscription-card-date-and-people">
        <div className="subscription-card-date">
          {getDaysAgoString(new Date(createdDate))}
        </div>
        <div className="subscription-card-people">
          <img
            alt="Number of people"
            className="subscription-card-people-icon"
            src="/people_icon.png"
          />
          {subscription.numberOfPeople}
        </div>
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
    <div className="search-panes">
      <div className="filter-pane">Filters</div>
      <div className="results-pane">
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              className="search-text-input"
              placeholder="Search for a subscription"
            />
            <button className="search-submit-button">
              <img
                alt="Search"
                className="search-icon"
                src="/search_icon.png"
              />
            </button>
          </div>
        </div>
        <div className="search-subscription-cards-container">
          {subscriptionCards}
        </div>
      </div>
    </div>
  );
};

export default SearchCanvas;
