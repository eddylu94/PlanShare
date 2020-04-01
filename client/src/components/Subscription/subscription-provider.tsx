import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import SubscriptionCanvas from "./subscription-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest } from "./../../base-requests";

const SubscriptionProviderWithContext = (props: {
  userData: IUserContext;
  subscriptionId: string;
}) => {
  const _userData = props.userData;

  const { subscriptionId } = props;

  const [subscriptionData, setSubscriptionData] = useState(null as any);

  const retrieveSubscriptionResponseHandler = (data: any) => {
    console.log(data);

    const newSubscriptionData = data?.body?.subscriptionData;
    if (newSubscriptionData) {
      console.log(newSubscriptionData);
      setSubscriptionData(newSubscriptionData);
    }
  };

  const retrieveSubscriptionErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscription = () => {
    baseGetRequest(
      "getsubscription",
      [{ subscriptionId }],
      retrieveSubscriptionResponseHandler,
      retrieveSubscriptionErrorHandler,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveSubscription();
    // eslint-disable-next-line
  }, [subscriptionId]);

  return <SubscriptionCanvas subscriptionData={subscriptionData} />;
};

const SubscriptionProvider = (props: { subscriptionId: string }) => (
  <UserDataContext.Consumer>
    {userData => (
      <SubscriptionProviderWithContext
        userData={userData}
        subscriptionId={props.subscriptionId}
      />
    )}
  </UserDataContext.Consumer>
);

export default SubscriptionProvider;
