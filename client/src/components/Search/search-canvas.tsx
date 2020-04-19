import React from "react";

import { ISubscriptionData } from "../../utils/utils";
import { ISearchFiltersProps } from "./search-utils";
import { DEVICE_MODE } from "./../../utils/constants";
import SearchFiltersPane from "./search-filters";
import SearchSubscriptionCard from "./search-subscription-card";
import Subscription from "./../Subscription/subscription-provider";

import useMediaQuery from "@material-ui/core/useMediaQuery";

interface ISearchCanvasProps {
  isFiltersDrawerOpen: boolean;
  subscriptionData: ISubscriptionData[];
  filtersText: string;
  selectedSubscription: string;
  searchFilters: ISearchFiltersProps;
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubscriptionCardClick: (subscriptionId: string) => void;
  closeModal: () => void;
  toggleFiltersDrawer: () => void;
}

const SearchCanvas = (props: ISearchCanvasProps) => {
  const {
    isFiltersDrawerOpen,
    subscriptionData,
    filtersText,
    selectedSubscription,
    searchFilters,
    handleTextChange,
    handleSubscriptionCardClick,
    closeModal,
    toggleFiltersDrawer
  } = props;

  const small = useMediaQuery("(max-width:768px)");
  const medium = useMediaQuery("(min-width:768px)");
  const large = useMediaQuery("(min-width:992px)");

  let deviceMode: string;
  if (small) {
    deviceMode = DEVICE_MODE.MOBILE;
  } else if (medium && !large) {
    deviceMode = DEVICE_MODE.TABLET;
  } else {
    deviceMode = DEVICE_MODE.DESKTOP;
  }

  const subscriptionCards = subscriptionData.map((subscription, i) => {
    return (
      <SearchSubscriptionCard
        key={"subscription-card-" + i}
        subscription={subscription}
        isMobile={deviceMode === DEVICE_MODE.MOBILE}
        handleSubscriptionCardClick={handleSubscriptionCardClick}
      />
    );
  });

  return (
    <div className="search-panes">
      {isFiltersDrawerOpen && deviceMode === DEVICE_MODE.MOBILE ? (
        <>
          <div className="overlay" onClick={toggleFiltersDrawer}></div>
          <div className="search-filters-drawer-container">
            <div className="search-filters-drawer">
              <SearchFiltersPane {...searchFilters} isDrawer={true} />
            </div>
          </div>
        </>
      ) : null}
      {selectedSubscription && deviceMode !== DEVICE_MODE.DESKTOP ? (
        <>
          <div className="overlay" onClick={closeModal}></div>
          <div className="search-modal-container">
            <div className="search-modal">
              <button className="close-button" onClick={closeModal}>
                <img alt="Close" className="close-icon" src="/close_icon.png" />
              </button>
              <Subscription subscriptionId={selectedSubscription} />
            </div>
          </div>
        </>
      ) : null}
      {deviceMode !== DEVICE_MODE.MOBILE ? (
        <SearchFiltersPane {...searchFilters} />
      ) : null}
      <div className="results-pane">
        <div className="search-bar-and-filter">
          {deviceMode === DEVICE_MODE.MOBILE ? (
            <button
              className="search-filters-button"
              onClick={toggleFiltersDrawer}
            >
              <img
                alt="Filter search results"
                className="filter-icon"
                src="/filter_icon.png"
              />
            </button>
          ) : null}
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
