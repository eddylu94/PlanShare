// Third-party libraries
import React, { useState, useEffect, useRef } from "react";
import { withRouter, Link } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";
import { History } from "history";

// Components
import SearchFiltersPane from "./search-filters";
import SearchSubscriptionCard from "./search-subscription-card";
import Subscription from "../Subscription/subscription";
import SearchCanvasPlaceholder from "./search-placeholder";

// API
import { baseGetRequest } from "../../base-requests";

// Utilites
import { IUserContext, UserDataContext } from "../../user-context-provider";
import {
  STATUS_CODE,
  STATUS_MESSAGE,
  DEVICE_MODE
} from "../../utils/constants";
import { SORT_BY, ISearchFiltersProps } from "./search-utils";
import {
  log,
  IFiltersSubscriptionCategory,
  IOrganization,
  ISubscriptionData,
  useDeviceMode
} from "../../utils/utils";
import { InputChangeEvent } from "../../utils/interfaces";

interface ISearchProviderProps {
  userData: IUserContext;
  history: History;
}

const THROTTLE_TIMEOUT = 250; // Allow at most one request to be executed per 250 milliseconds

const SearchProviderWithContext = (props: ISearchProviderProps) => {
  const { history, userData: _userData } = props;

  const isUser = !!_userData.user?.userId;

  let _throttle = useRef(null as any);

  const deviceMode = useDeviceMode();

  // Whether at least one request has been executed for retrieving subscriptions
  const [
    isRetrievedSubscriptionsDirty,
    setIsRetrievedSubscriptionsDirty
  ] = useState(false);

  const [organization, setOrganization] = useState({} as IOrganization);

  const [subscriptionData, setSubscriptionData] = useState(
    [] as Array<ISubscriptionData>
  );

  const [
    filtersSubscriptionCategories,
    setFiltersSubscriptionCategories
  ] = useState([] as Array<IFiltersSubscriptionCategory>);
  const [filtersText, setFiltersText] = useState("");
  const [filtersGroupSize, setFiltersGroupSize] = useState([1, 50]);
  const [filtersPrice, setFiltersPrice] = useState([0, 100]);
  const [filtersSortBy, setFiltersSortBy] = useState(SORT_BY.DATE_DES);
  const [filtersDaysActive, setFiltersDaysActive] = useState(5 * 365);

  const [selectedSubscription, setSelectedSubscription] = useState("");

  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

  const toggleFiltersDrawer = () => {
    setIsFiltersDrawerOpen(!isFiltersDrawerOpen);
  };

  const retrieveSubscriptionsResponseHandler = (data: any) => {
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      log("User not validated");
      history.push("/validate");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      log(data.body?.subscriptions);
      setSubscriptionData(data.body?.subscriptions);
      setIsRetrievedSubscriptionsDirty(true);
    }
  };

  const retrieveSubscriptions = (query?: { [key: string]: any }[]) => {
    baseGetRequest(
      _userData.user?.userId ? "getsubscriptions" : "getsubscriptionsasguest",
      query ?? [],
      retrieveSubscriptionsResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const toggleFiltersSubscriptionCategory = (
    event: InputChangeEvent,
    subscriptionCategoryId: string
  ) => {
    const list = filtersSubscriptionCategories.slice(0);
    let category = filtersSubscriptionCategories.find(
      category => category.subscriptionCategoryId === subscriptionCategoryId
    ) as IFiltersSubscriptionCategory;
    Object.assign(category, { isSelected: !category.isSelected });
    setFiltersSubscriptionCategories(list);
  };

  const handleTextChange = (event: InputChangeEvent) => {
    setFiltersText(event.target.value);
  };

  const handleGroupSizeChange = (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    event.preventDefault();

    const newValue = value as number[];
    setFiltersGroupSize(newValue);
  };

  const handlePriceChange = (event: Event, value: number | Array<number>) => {
    event.preventDefault();

    const newValue = value as number[];
    setFiltersPrice(newValue);
  };

  const handleDaysActiveChange = (
    event: React.ChangeEvent<{}>,
    value: number | Array<number>
  ) => {
    event.preventDefault();

    const newValue = value as number;
    setFiltersDaysActive(newValue);
  };

  const handleSortByChange = (event: InputChangeEvent) => {
    setFiltersSortBy((event.target as HTMLInputElement).value);
  };

  const handleSubscriptionCardClick = (subscriptionId: string) => {
    setSelectedSubscription(subscriptionId ? subscriptionId : "guest");
  };

  const closeModal = () => {
    setSelectedSubscription("");
  };

  const retrieveSubscriptionCategoriesResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      const subscriptionCategories = body.subscriptionCategories as IFiltersSubscriptionCategory[];
      const filterSubscriptionCategoriesData = subscriptionCategories.map(
        category => Object.assign(category, { isSelected: true })
      );
      setFiltersSubscriptionCategories(filterSubscriptionCategoriesData);
    }
  };

  const retrieveSubscriptionCategories = () => {
    baseGetRequest(
      "getsubscriptioncategories",
      [],
      retrieveSubscriptionCategoriesResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const retrieveOrganizationResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      console.log(data.body.organization);
      setOrganization(data.body.organization);
    }
  };

  const retrieveOrganization = () => {
    baseGetRequest(
      "getorganization",
      [],
      retrieveOrganizationResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    if (_throttle.current) {
      clearTimeout(_throttle.current);
    }

    const sc = filtersSubscriptionCategories
      ? filtersSubscriptionCategories
          .filter(category => category.isSelected)
          .map(category => category.subscriptionCategoryId)
          .join(",")
      : "";

    _throttle.current = setTimeout(() => {
      retrieveSubscriptions([
        { t: filtersText },
        { sc }, // Subscription category
        { gs: filtersGroupSize }, // Group size
        { p: filtersPrice }, // Price
        { sb: filtersSortBy }, // Sort by
        { da: filtersDaysActive } // Days active
      ]);
    }, THROTTLE_TIMEOUT);
    // eslint-disable-next-line
  }, [
    _throttle,
    filtersText,
    filtersSubscriptionCategories,
    filtersGroupSize,
    filtersPrice,
    filtersSortBy,
    filtersDaysActive
  ]);

  useEffect(() => {
    // retrieveSubscriptions();
    retrieveSubscriptionCategories();
    retrieveOrganization();
    // eslint-disable-next-line
  }, []);

  const searchFilters = {
    filtersSubscriptionCategories,
    filtersGroupSize,
    filtersPrice,
    filtersSortBy,
    filtersDaysActive,
    toggleFiltersSubscriptionCategory,
    handleGroupSizeChange,
    handlePriceChange,
    handleSortByChange,
    handleDaysActiveChange
  } as ISearchFiltersProps;

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
    height: "calc(100% - 40px)",
    ...(deviceMode === DEVICE_MODE.MOBILE
      ? {
          marginTop: 5
        }
      : {
          margin: "10px 0 20px 0"
        })
  };

  const organizationsMap = subscriptionData.reduce((map, subscription) => {
    return Object.assign(map, { [subscription.organization?.name]: 1 });
  }, {});
  const numberOfOrganizations = Object.keys(organizationsMap).length;

  return (
    <div className="search-panes">
      {isRetrievedSubscriptionsDirty ? (
        <div className="search-panes" style={{ justifyContent: "center" }}>
          {isFiltersDrawerOpen && deviceMode === DEVICE_MODE.MOBILE && (
            <>
              <div className="overlay" onClick={toggleFiltersDrawer}></div>
              <div className="search-filters-drawer-container">
                <div className="search-filters-drawer">
                  <SearchFiltersPane {...searchFilters} isDrawer />
                </div>
              </div>
            </>
          )}

          {selectedSubscription &&
            deviceMode !== DEVICE_MODE.DESKTOP &&
            deviceMode !== DEVICE_MODE.LARGE_DESKTOP && (
              <>
                <div className="overlay" onClick={closeModal}></div>
                <div className="search-modal-container">
                  <div className="search-modal">
                    <button className="close-button" onClick={closeModal}>
                      <img
                        alt="Close"
                        className="close-icon"
                        src="/close_icon.png"
                      />
                    </button>
                    <Subscription subscriptionId={selectedSubscription} />
                  </div>
                </div>
              </>
            )}

          {deviceMode !== DEVICE_MODE.MOBILE && (
            <SearchFiltersPane {...searchFilters} />
          )}

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
                    placeholder="Search listings"
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
                    {numberOfOrganizations === 1
                      ? "organization"
                      : "organizations"}
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
              <div
                className="subscription-pane search-pane"
                style={{
                  ...(selectedSubscription && { height: "fit-content" })
                }}
              >
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
                <span style={{ fontWeight: 600 }}>
                  Select a listing to get started
                </span>
                {!isUser && (
                  <>
                    <br />
                    <span>
                      Please <Link to="/login">log in</Link> or{" "}
                      <Link to="/signup">sign up</Link> to view listing details
                      within an organization
                    </span>
                  </>
                )}
              </div>
            )
          ) : null}
        </div>
      ) : (
        <div className="animate-flicker">
          <SearchCanvasPlaceholder />
        </div>
      )}
    </div>
  );
};

const SearchProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <SearchProviderWithContext userData={userData} history={props.history} />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(SearchProvider);
