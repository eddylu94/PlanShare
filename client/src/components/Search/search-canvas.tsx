import React from "react";

import { ISubscriptionData } from "../../utils/utils";
import { ISearchFiltersProps } from "./search-utils";
import SearchFiltersPane from "./search-filters";
import SearchSubscriptionCard from "./search-subscription-card";
import Subscription from "./../Subscription/subscription-provider";

interface ISearchCanvasProps {
  subscriptionData: ISubscriptionData[];
  filtersText: string;
  selectedSubscription: string;
  searchFilters: ISearchFiltersProps;
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubscriptionCardClick: (subscriptionId: string) => void;
}

const SearchCanvas = (props: ISearchCanvasProps) => {
  const {
    subscriptionData,
    filtersText,
    selectedSubscription,
    searchFilters,
    handleTextChange,
    handleSubscriptionCardClick
  } = props;

  const subscriptionCards = subscriptionData.map((subscription, i) => {
    return (
      <SearchSubscriptionCard
        key={"subscription-card-" + i}
        subscription={subscription}
        handleSubscriptionCardClick={handleSubscriptionCardClick}
      />
    );
  });

  return (
    <div className="search-panes">
      <SearchFiltersPane {...searchFilters} />
      <div className="results-pane">
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              className="search-text-input"
              placeholder="Search for a subscription"
              value={filtersText}
              onChange={handleTextChange}
              autoFocus
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
      {selectedSubscription ? (
        <div className="subscription-pane search-pane">
          <Subscription subscriptionId={selectedSubscription} />
        </div>
      ) : null}
    </div>
  );
};

export default SearchCanvas;
