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

  const [filtersOrganizations, setFiltersOrganizations] = useState(
    [] as IFiltersOrganization[]
  );

  const [
    filtersSubscriptionCategories,
    setFiltersSubscriptionCategories
  ] = useState([] as IFiltersSubscriptionCategory[]);

  const [filtersGroupSize, setFiltersGroupSize] = useState([2, 5]);

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

  const handleGroupSizeChange = (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    event.preventDefault();

    const newValue = value as number[];
    setFiltersGroupSize(newValue);
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
    _throttle.current = setTimeout(() => {
      retrieveSubscriptions([{ gs: filtersGroupSize }]);
    }, THROTTLE_TIMEOUT);
  }, [_throttle, filtersGroupSize]);

  useEffect(() => {
    retrieveSubscriptions();
    retrieveOrganizations();
    retrieveSubscriptionCategories();
    // eslint-disable-next-line
  }, []);

  return (
    <SearchCanvas
      subscriptionData={subscriptionData}
      filtersOrganizations={filtersOrganizations}
      filtersSubscriptionCategories={filtersSubscriptionCategories}
      filtersGroupSize={filtersGroupSize}
      toggleFiltersOrganization={toggleFiltersOrganization}
      toggleFiltersSubscriptionCategory={toggleFiltersSubscriptionCategory}
      handleGroupSizeChange={handleGroupSizeChange}
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
