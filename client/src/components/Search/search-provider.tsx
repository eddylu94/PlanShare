import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { IUserContext, UserDataContext } from "./../../user-context-provider";
import SearchCanvas from "./search-canvas";
import { baseGetRequest } from "./../../base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "../../utils/constants";
import { IFiltersSubscriptionCategory } from "./../../utils/utils";
import { SORT_BY, ISearchFiltersProps } from "./search-utils";
import SearchCanvasPlaceholder from "./search-canvas-placeholder";

const THROTTLE_TIMEOUT = 250; // Allow at most one request to be executed per 250 milliseconds

interface ISearchProviderProps {
  userData: IUserContext;
  history: History;
}

const SearchProviderWithContext = (props: ISearchProviderProps) => {
  const _userData = props.userData;

  // Whether at least one request has been executed for retrieving subscriptions
  const [
    isRetrievedSubscriptionsDirty,
    setIsRetrievedSubscriptionsDirty
  ] = useState(false);

  let _throttle = useRef(null as any);

  const { history } = props;

  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

  const [subscriptionData, setSubscriptionData] = useState([]);

  const [filtersText, setFiltersText] = useState("");

  const [
    filtersSubscriptionCategories,
    setFiltersSubscriptionCategories
  ] = useState([] as IFiltersSubscriptionCategory[]);

  const [filtersGroupSize, setFiltersGroupSize] = useState([1, 50]);

  const [filtersPrice, setFiltersPrice] = useState([0, 100]);

  const [filtersSortBy, setFiltersSortBy] = useState(SORT_BY.DATE_DES);

  const [filtersDaysActive, setFiltersDaysActive] = useState(30);

  const [selectedSubscription, setSelectedSubscription] = useState("");

  const toggleFiltersDrawer = () => {
    setIsFiltersDrawerOpen(!isFiltersDrawerOpen);
  };

  const retrieveSubscriptionsResponseHandler = (data: any) => {
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      console.log("User not validated");
      history.push("/validate");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      console.log(data.body?.subscriptions);
      setSubscriptionData(data.body?.subscriptions);
      setIsRetrievedSubscriptionsDirty(true);
    }
  };

  const retrieveSubscriptionsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptions = (query?: { [key: string]: any }[]) => {
    baseGetRequest(
      _userData.user?.userId ? "getsubscriptions" : "getsubscriptionsasguest",
      query ?? [],
      retrieveSubscriptionsResponseHandler,
      retrieveSubscriptionsErrorHandler,
      _userData.user?.auth
    );
  };

  const toggleFiltersSubscriptionCategory = (
    event: React.ChangeEvent<HTMLInputElement>,
    subscriptionCategoryId: string
  ) => {
    const list = filtersSubscriptionCategories.slice(0);
    let category = filtersSubscriptionCategories.find(
      category => category.subscriptionCategoryId === subscriptionCategoryId
    ) as IFiltersSubscriptionCategory;
    Object.assign(category, { isSelected: !category.isSelected });
    setFiltersSubscriptionCategories(list);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePriceChange = (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    event.preventDefault();

    const newValue = value as number[];
    setFiltersPrice(newValue);
  };

  const handleDaysActiveChange = (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    event.preventDefault();

    const newValue = value as number;
    setFiltersDaysActive(newValue);
  };

  const handleSortByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const retrieveSubscriptionCategoriesErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptionCategories = () => {
    baseGetRequest(
      "getsubscriptioncategories",
      [],
      retrieveSubscriptionCategoriesResponseHandler,
      retrieveSubscriptionCategoriesErrorHandler,
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

  return (
    <div className="search-panes">
      {isRetrievedSubscriptionsDirty ? (
        <SearchCanvas
          isFiltersDrawerOpen={isFiltersDrawerOpen}
          subscriptionData={subscriptionData}
          filtersText={filtersText}
          selectedSubscription={selectedSubscription}
          searchFilters={searchFilters}
          handleTextChange={handleTextChange}
          handleSubscriptionCardClick={handleSubscriptionCardClick}
          closeModal={closeModal}
          toggleFiltersDrawer={toggleFiltersDrawer}
        />
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
