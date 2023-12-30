// Third-party libraries
import React from "react";

// Components
import SearchSubscriptionCardPlaceholder from "./search-subscription-card-placeholder";

// Utilities
import { DEVICE_MODE } from "@utils/constants";
import { useDeviceMode } from "@utils/utils";

const SearchCanvasPlaceholder = (props: { isProfile?: boolean }) => {
  const deviceMode = useDeviceMode();

  const subscriptionCards = [];

  for (let i = 0; i < 4; i++) {
    subscriptionCards.push(
      <SearchSubscriptionCardPlaceholder
        key={`search-subscription-card-placeholder-${i}`}
      />
    );
  }

  return (
    <div className="search-panes" style={{ justifyContent: "center" }}>
      {deviceMode !== DEVICE_MODE.MOBILE ? (
        <div
          className="filter-pane search-pane"
          style={{ margin: "20px 10px 20px 20px" }}
        >
          <div
            key={"filter-placeholder-0"}
            className="placeholder-filters-header-shape placeholder-background"
            style={{ marginTop: 5 }}
          ></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filters-header-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filters-header-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
        </div>
      ) : null}
      <div className="results-pane">
        <div className="search-bar-and-filter">
          {deviceMode === DEVICE_MODE.MOBILE ? (
            <div className="search-filters-button"></div>
          ) : null}
          <div className="search-bar-container">
            <div className="search-bar">
              <div className="search-text-input" />
              <div className="search-submit-button"></div>
            </div>
          </div>
        </div>
        <div
          className="search-number-of-results flex-vertical-centered"
          style={{ maxHeight: 30, height: 30, marginBottom: 5 }}
        ></div>
        <div className="search-subscription-cards-container">
          {subscriptionCards}
        </div>
      </div>
      {deviceMode === DEVICE_MODE.DESKTOP ||
      deviceMode === DEVICE_MODE.LARGE_DESKTOP ? (
        <div
          className="subscription-pane search-pane"
          style={{ backgroundColor: "#fff", height: 500 }}
        ></div>
      ) : null}
    </div>
  );
};

export default SearchCanvasPlaceholder;
