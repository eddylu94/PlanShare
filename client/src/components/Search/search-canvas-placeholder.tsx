import React from "react";

import { DEVICE_MODE } from "./../../utils/constants";
import SearchSubscriptionCardPlaceholder from "./search-subscription-card-placeholder";

import useMediaQuery from "@material-ui/core/useMediaQuery";

const SearchCanvasPlaceholder = (props: { isProfile?: boolean }) => {
  const small = useMediaQuery("(max-width:768px)");
  const medium = useMediaQuery("(min-width:768px)");
  const large = useMediaQuery("(min-width:992px)");
  const xLarge = useMediaQuery("(min-width:1200px)");

  let deviceMode: string;
  if (small) {
    deviceMode = DEVICE_MODE.MOBILE;
  } else if (medium && !large) {
    deviceMode = DEVICE_MODE.TABLET;
  } else if (large && !xLarge) {
    deviceMode = DEVICE_MODE.DESKTOP;
  } else {
    deviceMode = DEVICE_MODE.LARGE_DESKTOP;
  }

  const subscriptionCards = [
    <SearchSubscriptionCardPlaceholder
      key={"search-subscription-card-placeholder-0"}
    />,
    <SearchSubscriptionCardPlaceholder
      key={"search-subscription-card-placeholder-1"}
    />
  ];

  return (
    <div className="search-panes">
      {deviceMode !== DEVICE_MODE.MOBILE ? (
        <div
          className="filter-pane search-pane"
          style={{ margin: "20px 10px 20px 20px" }}
        >
          <div
            key={"filter-placeholder-0"}
            className="placeholder-filters-header-shape placeholder-background"
            style={{ marginTop: 0 }}
          ></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
          <div className="placeholder-filters-header-shape placeholder-background"></div>
          <div className="placeholder-filter-shape placeholder-background"></div>
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
          className="search-number-of-results flex-horizontal-centered"
          style={{ maxHeight: 30, height: 30, marginBottom: 5 }}
        ></div>
        <div className="search-subscription-cards-container">
          {subscriptionCards}
        </div>
      </div>
    </div>
  );
};

export default SearchCanvasPlaceholder;
