import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import CreateListingCanvas from "./create-listing-canvas";
import { FORM_INPUT_TYPE } from "./create-listing-utils";
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
  const [subscriptionUrl, setSubscriptionUrl] = useState("");

  const [listingTitle, setListingTitle] = useState("");
  const [listingDescription, setListingDescription] = useState("");

  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [price, setPrice] = useState(0);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const [groups, setGroups] = useState([]);
  const [groupSelection, setGroupSelection] = useState("");

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

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    console.log("ASfasfsa");
    const target = event.target;
    const value = target.value;
    const name = target.name;

    switch (name) {
      case FORM_INPUT_TYPE.SUBSCRIPTION_TYPE:
        setSubscriptionTypeSelection(value);
        break;
      case FORM_INPUT_TYPE.SUBSCRIPTION_GROUP:
        setSubscriptionGroupSelection(value);
        break;
      case FORM_INPUT_TYPE.SUBSCRIPTION_URL:
        setSubscriptionUrl(value);
        break;
      case FORM_INPUT_TYPE.LISTING_TITLE:
        setListingTitle(value);
        break;
      case FORM_INPUT_TYPE.LISTING_DESCRIPTION:
        setListingDescription(value);
        break;
      case FORM_INPUT_TYPE.NUMBER_OF_PEOPLE:
        setNumberOfPeople(value);
        break;
      case FORM_INPUT_TYPE.PRICE:
        setPrice(value);
        break;
      default:
        break;
    }
  };

  const retrieveGroupsResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;
      setGroups(body.groups);
      setGroupSelection(body.defaultGroup);
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

  const handleSubmitResponseHandler = (data: any) => {
    console.log(data);
  };

  const handleSubmitErrorHandler = (err: any) => {
    console.log(err);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const params = {
      subscriptionTypeSelection,
      subscriptionGroupSelection,
      subscriptionUrl,
      listingTitle,
      listingDescription,
      numberOfPeople,
      price,
      groupSelection
    };
    console.log(params);
    if (!isFormDisabled) {
      // const postRequestData = {
      // };
      // basePostRequest(
      //   "signup",
      //   postRequestData,
      //   handleSubmitResponseHandler,
      //   handleSubmitErrorHandler
      // );
    }

    event.preventDefault();
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

  useEffect(() => {
    const newIsFormDisabled = !(
      subscriptionUrl &&
      listingTitle &&
      listingDescription &&
      numberOfPeople &&
      price
    );
    setIsFormDisabled(newIsFormDisabled);
  }, [
    subscriptionUrl,
    listingTitle,
    listingDescription,
    numberOfPeople,
    price
  ]);

  return (
    <CreateListingCanvas
      handleInputChange={handleInputChange}
      subscriptionTypes={subscriptionTypes}
      subscriptionGroup={subscriptionGroup}
      subscriptionGroupSelection={subscriptionGroupSelection}
      groups={groups}
      subscriptionUrl={subscriptionUrl}
      listingTitle={listingTitle}
      listingDescription={listingDescription}
      numberOfPeople={numberOfPeople}
      price={price}
      isFormDisabled={isFormDisabled}
      handleSubmit={handleSubmit}
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
