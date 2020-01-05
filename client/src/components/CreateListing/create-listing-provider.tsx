import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import CreateListingCanvas from "./create-listing-canvas";
import {
  SUBSCRIPTION_TYPE,
  getSubscriptionGroup,
  LIVE_TV_STREAMING
} from "./../../subscriptions";

import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest } from "./../../base-requests";
import { STATUS_CODE } from "./../../utils/constants";

const CreateListingProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  const [subscriptionGroup, setSubscriptionGroup] = useState(LIVE_TV_STREAMING);
  const [subscriptionGroupSelection, setSubscriptionGroupSelection] = useState(
    LIVE_TV_STREAMING.YOUTUBE
  );

  const [groups, setGroups] = useState([]);

  const handleChangeSubscriptionType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSubscriptionGroup = getSubscriptionGroup(event.target.value);
    setSubscriptionGroup(newSubscriptionGroup);
  };

  const handleChangeSubscriptionGroup = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSubscription = event.target.value;
    setSubscriptionGroupSelection(newSubscription);
  };

  const retrieveGroupsResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      setGroups(data.body.groups);
    }
  };

  const retrieveGroupsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveGroups = () => {
    baseGetRequest(
      "getGroups",
      [],
      retrieveGroupsResponseHandler,
      retrieveGroupsErrorHandler,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveGroups();
    // eslint-disable-next-line
  }, []);

  return (
    <CreateListingCanvas
      subscriptionTypes={SUBSCRIPTION_TYPE}
      subscriptionGroup={subscriptionGroup}
      subscriptionGroupSelection={subscriptionGroupSelection}
      groups={groups}
      handleChangeSubscriptionType={handleChangeSubscriptionType}
      handleChangeSubscriptionGroup={handleChangeSubscriptionGroup}
    />
  );
};

const CreateListingProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <CreateListingProviderWithContext
        userData={userData}
        history={props.history}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(CreateListingProvider);
