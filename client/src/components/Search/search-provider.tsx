import React, { useEffect } from "react";

import { IUserContext, UserDataContext } from "./../../user-context-provider";
import SearchCanvas from "./search-canvas";
import { baseGetRequest } from "./../../base-requests";

interface ISearchProviderProps {
  userData: IUserContext;
}

const SearchProviderWithContext = (props: ISearchProviderProps) => {
  const _userData = props.userData;

  const retrieveSubscriptionsResponseHandler = (data: any) => {
    console.log(data);
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

  return <SearchCanvas />;
};

const SearchProvider = () => (
  <UserDataContext.Consumer>
    {userData => <SearchProviderWithContext userData={userData} />}
  </UserDataContext.Consumer>
);

export default SearchProvider;
