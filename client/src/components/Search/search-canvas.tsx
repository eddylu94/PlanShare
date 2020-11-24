import React from "react";
import { Link } from "react-router-dom";

import { ISubscriptionData, IOrganization } from "../../utils/utils";
import { ISearchFiltersProps } from "./search-utils";
import { DEVICE_MODE } from "./../../utils/constants";
import SearchFiltersPane from "./search-filters";
import SearchSubscriptionCard from "./search-subscription-card";
import Subscription from "./../Subscription/subscription-provider";

import Scrollbars from "react-custom-scrollbars";

import useMediaQuery from "@material-ui/core/useMediaQuery";

interface ISearchCanvasProps {
  organization: IOrganization;
  isFiltersDrawerOpen: boolean;
  subscriptionData: ISubscriptionData[];
  filtersText: string;
  selectedSubscription: string;
  searchFilters: ISearchFiltersProps;
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubscriptionCardClick: (subscriptionId: string) => void;
  closeModal: () => void;
  toggleFiltersDrawer: () => void;
  isUser: boolean;
}

const SearchCanvas = (props: ISearchCanvasProps) => {
  const {
    organization,
    isFiltersDrawerOpen,
    subscriptionData,
    filtersText,
    selectedSubscription,
    searchFilters,
    handleTextChange,
    handleSubscriptionCardClick,
    closeModal,
    toggleFiltersDrawer,
    isUser
  } = props;

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

  const scrollBarsStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    borderRadius: 10,
    height: "calc(100% - 40px)"
  };

  if (deviceMode === DEVICE_MODE.MOBILE) {
    Object.assign(scrollBarsStyle, {
      marginTop: 5
    });
  } else {
    Object.assign(scrollBarsStyle, {
      margin: "10px 0 20px 0"
    });
  }

  const organizationsMap = subscriptionData.reduce((map, subscription) => {
    const organization = subscription.organization?.name;
    return Object.assign(map, { [organization]: 1 });
  }, {});
  const numberOfOrganizations = Object.keys(organizationsMap).length;

  return (
    <div className="search-panes" style={{ justifyContent: "center" }}>
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
      {selectedSubscription &&
      deviceMode !== DEVICE_MODE.DESKTOP &&
      deviceMode !== DEVICE_MODE.LARGE_DESKTOP ? (
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
        <div
          className="search-number-of-results flex-horizontal-centered"
          style={{ maxHeight: 30, height: 30 }}
        >
          {organization?.name ? (
            <>
              <span className="b" style={{ marginRight: 5 }}>
                {subscriptionData.length}{" "}
                {subscriptionData.length === 1 ? "result" : "results"}
              </span>{" "}
              found for{" "}
              <span className="b" style={{ marginLeft: 5 }}>
                {organization.name}
              </span>
              <img
                alt="Organization logo"
                className="subscription-card-organization-logo"
                src={organization.logo}
              />
            </>
          ) : (
            <>
              <span className="b" style={{ marginRight: 5 }}>
                {subscriptionData.length} results
              </span>{" "}
              found across{" "}
              <span className="b" style={{ marginLeft: 5 }}>
                {numberOfOrganizations}{" "}
                {numberOfOrganizations === 1 ? "organization" : "organizations"}
              </span>
            </>
          )}
        </div>
        <Scrollbars autoHide style={scrollBarsStyle}>
          <div className="search-subscription-cards-container">
            {subscriptionCards}
          </div>
        </Scrollbars>
      </div>
      {deviceMode === DEVICE_MODE.DESKTOP ||
      deviceMode === DEVICE_MODE.LARGE_DESKTOP ? (
        selectedSubscription ? (
          <div className="subscription-pane search-pane">
            <Subscription subscriptionId={selectedSubscription} />
          </div>
        ) : (
          <div
            className="subscription-pane subscription-pane-placeholder"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center"
            }}
          >
            <span style={{ fontWeight: 500 }}>
              Select a listing to view its details
            </span>
            {!isUser ? (
              <>
                <br />
                <span>
                  Please <Link to="/login">log in</Link> or{" "}
                  <Link to="/signup">sign up</Link> to view listing details
                  within an organization
                </span>
              </>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  );
};

export default SearchCanvas;
