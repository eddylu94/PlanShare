import React, { useState, useEffect } from "react";

import { IUserContext, UserDataContext } from "./../../user-context-provider";
import SearchCanvas from "./search-canvas";
import { baseGetRequest } from "./../../base-requests";
import { STATUS_CODE } from "../../utils/constants";
import { IFiltersOrganization } from "./../../utils/utils";

interface ISearchProviderProps {
  userData: IUserContext;
}

const SearchProviderWithContext = (props: ISearchProviderProps) => {
  const _userData = props.userData;

  const [subscriptionData, setSubscriptionData] = useState([]);

  const [filtersOrganizations, setFiltersOrganizations] = useState(
    [] as IFiltersOrganization[]
  );

  const retrieveSubscriptionsResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      console.log(data.body?.subscriptions);
      setSubscriptionData(data.body?.subscriptions);
    }
  };

  const retrieveSubscriptionsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptions = () => {
    baseGetRequest(
      "getsubscriptions",
      [],
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

  useEffect(() => {
    retrieveSubscriptions();
    retrieveOrganizations();
    // eslint-disable-next-line
  }, []);

  return (
    <SearchCanvas
      subscriptionData={subscriptionData}
      filterOrganizations={filtersOrganizations}
      toggleFiltersOrganization={toggleFiltersOrganization}
    />
  );
};

const SearchProvider = () => (
  <UserDataContext.Consumer>
    {userData => <SearchProviderWithContext userData={userData} />}
  </UserDataContext.Consumer>
);

export default SearchProvider;
