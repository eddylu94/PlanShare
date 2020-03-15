import React, { useState, useEffect } from "react";

import { IUserContext, UserDataContext } from "./../../user-context-provider";
import SearchCanvas from "./search-canvas";
import { baseGetRequest } from "./../../base-requests";
import { STATUS_CODE } from "../../utils/constants";

interface ISearchProviderProps {
  userData: IUserContext;
}

const SearchProviderWithContext = (props: ISearchProviderProps) => {
  const _userData = props.userData;

  const [subscriptionData, setSubscriptionData] = useState([]);

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

  useEffect(() => {
    retrieveSubscriptions();
    // eslint-disable-next-line
  }, []);

  return <SearchCanvas subscriptionData={subscriptionData} />;
};

const SearchProvider = () => (
  <UserDataContext.Consumer>
    {userData => <SearchProviderWithContext userData={userData} />}
  </UserDataContext.Consumer>
);

export default SearchProvider;
