import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { IUserContext, UserDataContext } from "./../../user-context-provider";
import SearchCanvas from "./search-canvas";
import { baseGetRequest } from "./../../base-requests";
import { STATUS_CODE } from "../../utils/constants";
import {
  IFiltersOrganization,
  IFiltersSubscriptionCategory
} from "./../../utils/utils";
import { SORT_BY, ISearchFiltersProps } from "./search-utils";

const THROTTLE_TIMEOUT = 250; // Allow at most one request to be executed per 250 milliseconds

interface ISearchProviderProps {
  userData: IUserContext;
  history: History;
}

const SearchProviderWithContext = (props: ISearchProviderProps) => {
  const _userData = props.userData;

  let _throttle = useRef(null as any);

  const { history } = props;

  if (!_userData.user?.userId) {
    history.push("/signup");
  }

  const [subscriptionData, setSubscriptionData] = useState([]);

  const [filtersText, setFiltersText] = useState("");

  const [filtersOrganizations, setFiltersOrganizations] = useState(
    [] as IFiltersOrganization[]
  );

  const [
    filtersSubscriptionCategories,
    setFiltersSubscriptionCategories
  ] = useState([] as IFiltersSubscriptionCategory[]);

  const [filtersGroupSize, setFiltersGroupSize] = useState([1, 10]);

  const [filtersSortBy, setFiltersSortBy] = useState(SORT_BY.DATE_DES);

  const [filtersDaysActive, setFiltersDaysActive] = useState(30);

  const [selectedSubscription, setSelectedSubscription] = useState("");

  const retrieveSubscriptionsResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      console.log(data.body?.subscriptions);
      setSubscriptionData(data.body?.subscriptions);
    }
  };

  const retrieveSubscriptionsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptions = (query?: { [key: string]: any }[]) => {
    baseGetRequest(
      "getsubscriptions",
      query ?? [],
      retrieveSubscriptionsResponseHandler,
      retrieveSubscriptionsErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveOrganizationsResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;
      const organizations = body.organizations as IFiltersOrganization[];
      const filterOrganizationsData = organizations.map(
        (organization: IFiltersOrganization) => {
          return {
            organizationId: organization.organizationId,
            name: organization.name,
            isSelected: true
          };
        }
      );
      setFiltersOrganizations(filterOrganizationsData);
    }
  };

  const retrieveOrganizationsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveOrganizations = () => {
    baseGetRequest(
      "getorganizations",
      [],
      retrieveOrganizationsResponseHandler,
      retrieveOrganizationsErrorHandler,
      _userData.user?.auth
    );
  };

  const toggleFiltersOrganization = (
    event: React.ChangeEvent<HTMLInputElement>,
    organizationId: string
  ) => {
    const list = filtersOrganizations.slice(0);
    let organization = filtersOrganizations.find(
      organization => organization.organizationId === organizationId
    ) as IFiltersOrganization;
    Object.assign(organization, { isSelected: !organization.isSelected });
    setFiltersOrganizations(list);
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
    setSelectedSubscription(subscriptionId);
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

    const o = filtersOrganizations
      ? filtersOrganizations
          .filter(organization => organization.isSelected)
          .map(organization => organization.organizationId)
          .join(",")
      : [];

    _throttle.current = setTimeout(() => {
      retrieveSubscriptions([
        { t: filtersText },
        { o }, // Subscription organization
        { sc }, // Subscription category
        { gs: filtersGroupSize }, // Group size
        { sb: filtersSortBy }, // Sort by
        { da: filtersDaysActive } // Days active
      ]);
    }, THROTTLE_TIMEOUT);
    // eslint-disable-next-line
  }, [
    _throttle,
    filtersText,
    filtersSubscriptionCategories,
    filtersOrganizations,
    filtersGroupSize,
    filtersSortBy,
    filtersDaysActive
  ]);

  useEffect(() => {
    // retrieveSubscriptions();
    retrieveOrganizations();
    retrieveSubscriptionCategories();
    // eslint-disable-next-line
  }, []);

  const searchFilters = {
    filtersOrganizations,
    filtersSubscriptionCategories,
    filtersGroupSize,
    filtersSortBy,
    filtersDaysActive,
    toggleFiltersOrganization,
    toggleFiltersSubscriptionCategory,
    handleGroupSizeChange,
    handleSortByChange,
    handleDaysActiveChange
  } as ISearchFiltersProps;

  return (
    <SearchCanvas
      subscriptionData={subscriptionData}
      filtersText={filtersText}
      selectedSubscription={selectedSubscription}
      searchFilters={searchFilters}
      handleTextChange={handleTextChange}
      handleSubscriptionCardClick={handleSubscriptionCardClick}
      closeModal={closeModal}
    />
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
