import React from "react";

import { ISubscriptionData } from "../../utils/utils";
import { ISearchFiltersProps } from "./search-utils";
import { DEVICE_MODE } from "./../../utils/constants";
import SearchFiltersPane from "./search-filters";
import SearchSubscriptionCard from "./search-subscription-card";
import Subscription from "./../Subscription/subscription-provider";

import useMediaQuery from "@material-ui/core/useMediaQuery";

interface ISearchCanvasProps {
  subscriptionData: ISubscriptionData[];
  filtersText: string;
  selectedSubscription: string;
  searchFilters: ISearchFiltersProps;
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubscriptionCardClick: (subscriptionId: string) => void;
  closeModal: () => void;
}

const SearchCanvas = (props: ISearchCanvasProps) => {
  const {
    subscriptionData,
    filtersText,
    selectedSubscription,
    searchFilters,
    handleTextChange,
    handleSubscriptionCardClick,
    closeModal
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

  const small = useMediaQuery("(max-width:768px)");
  const medium = useMediaQuery("(min-width:768px)");
  const large = useMediaQuery("(min-width:992px)");

  let deviceMode;
  if (small) {
    deviceMode = DEVICE_MODE.MOBILE;
  } else if (medium && !large) {
    deviceMode = DEVICE_MODE.TABLET;
  } else {
    deviceMode = DEVICE_MODE.DESKTOP;
  }

  return (
    <div className="search-panes">
      {selectedSubscription &&
      (deviceMode === DEVICE_MODE.MOBILE ||
        deviceMode === DEVICE_MODE.TABLET) ? (
        <>
          <div className="overlay" onClick={closeModal}></div>
          <div className="search-modal-container">
            <div className="search-modal">
              <Subscription subscriptionId={selectedSubscription} />
            </div>
          </div>
        </>
      ) : null}
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
        {filtersText && !subscriptionData.length ? (
          <div className="subscription-pane search-no-results">
            No results found for <span className="b">{filtersText}</span>
          </div>
        ) : (
          <div className="search-subscription-cards-container">
            {subscriptionCards}
          </div>
        )}
      </div>
      {selectedSubscription && deviceMode === DEVICE_MODE.DESKTOP ? (
        <div className="subscription-pane search-pane">
          <Subscription subscriptionId={selectedSubscription} />
        </div>
      ) : null}
    </div>
  );
};

export default SearchCanvas;
