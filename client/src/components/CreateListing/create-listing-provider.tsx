import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import CreateListingCanvas from "./create-listing-canvas";

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

  const [subscriptionTypes, setSubscriptionTypes] = useState({ default: "" });
  const [subscriptionTypeSelection, setSubscriptionTypeSelection] = useState(
    ""
  );
  const [subscriptionGroup, setSubscriptionGroup] = useState({ default: "" });
  const [subscriptionGroupSelection, setSubscriptionGroupSelection] = useState(
    ""
  );

  const [groups, setGroups] = useState([]);

  const handleChangeSubscriptionType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selection = event.target.value;
    setSubscriptionTypeSelection(selection);
    retrieveSubscriptionGroup(selection);
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

  const retrieveSubscriptionTypes = () => {
    baseGetRequest(
      "getSubscriptionTypes",
      [],
      retrieveSubscriptionTypesResponseHandler,
      retrieveSubscriptionTypesErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveSubscriptionTypesResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      const newSubscriptionTypes = body.subscriptionTypes;
      setSubscriptionTypes(newSubscriptionTypes);

      const newDefaultSubscriptionType = body.defaultSubscriptionType;
      setSubscriptionTypeSelection(newDefaultSubscriptionType);
    }
  };

  const retrieveSubscriptionTypesErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptionGroup = (selection: string) => {
    console.log(selection);
    baseGetRequest(
      "getSubscriptionGroup",
      [{ subscriptionType: selection }],
      retrieveSubscriptionGroupResponseHandler,
      retrieveSubscriptionGroupErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveSubscriptionGroupResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      const newSubscriptionGroup = body.subscriptionGroup;
      setSubscriptionGroup(newSubscriptionGroup);

      const newDefaultSubscriptionGroup = body.defaultSubscriptionGroup;
      setSubscriptionGroupSelection(newDefaultSubscriptionGroup);
    }
  };

  const retrieveSubscriptionGroupErrorHandler = (error: any) => {
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
    retrieveSubscriptionTypes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    retrieveSubscriptionGroup(subscriptionTypeSelection);
    // eslint-disable-next-line
  }, [subscriptionTypeSelection]);

  return (
    <CreateListingCanvas
      subscriptionTypes={subscriptionTypes}
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
