import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import CreateListingCanvas from "./create-listing-canvas";
import { FORM_INPUT_TYPE } from "./create-listing-utils";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
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

  const [subscriptionCategories, setSubscriptionCategories] = useState([]);
  const [
    subscriptionCategorySelection,
    setSubscriptionCategorySelection
  ] = useState("");
  const [subscriptionBrands, setSubscriptionBrands] = useState([]);
  const [subscriptionBrandSelection, setSubscriptionBrandSelection] = useState(
    ""
  );
  const [subscriptionUrl, setSubscriptionUrl] = useState("");

  const [listingTitle, setListingTitle] = useState("");
  const [listingDescription, setListingDescription] = useState("");

  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [price, setPrice] = useState(0);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const [organizations, setOrganizations] = useState([]);
  const [organizationSelection, setOrganizationSelection] = useState("");

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    switch (name) {
      case FORM_INPUT_TYPE.SUBSCRIPTION_TYPE:
        setSubscriptionCategorySelection(value);
        break;
      case FORM_INPUT_TYPE.SUBSCRIPTION_BRAND:
        setSubscriptionBrandSelection(value);
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

  const retrieveOrganizationsResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;
      setOrganizations(body.organizations);
      setOrganizationSelection(body.defaultOrganization);
    }
  };

  const retrieveOrganizationsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptionCategoriesResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      const newSubscriptionCategories = body.subscriptionCategories;
      setSubscriptionCategories(newSubscriptionCategories);

      const newDefaultSubscriptionCategory = body.defaultSubscriptionCategory;
      setSubscriptionCategorySelection(newDefaultSubscriptionCategory);
    }
  };

  const retrieveSubscriptionCategoriesErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptionCategories = () => {
    baseGetRequest(
      "getSubscriptionCategories",
      [],
      retrieveSubscriptionCategoriesResponseHandler,
      retrieveSubscriptionCategoriesErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveSubscriptionBrandsResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      const subscriptionBrands = body.subscriptionBrands;
      setSubscriptionBrands(subscriptionBrands);

      const newDefaultSubscriptionBrand = body.defaultSubscriptionBrands;
      setSubscriptionBrandSelection(newDefaultSubscriptionBrand);
    }
  };

  const retrieveSubscriptionBrandsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptionBrands = (selection: string) => {
    baseGetRequest(
      "getSubscriptionBrands",
      [{ subscriptionCategory: selection }],
      retrieveSubscriptionBrandsResponseHandler,
      retrieveSubscriptionBrandsErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveOrganizations = () => {
    baseGetRequest(
      "getOrganizations",
      [],
      retrieveOrganizationsResponseHandler,
      retrieveOrganizationsErrorHandler,
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
    const postRequestData = {
      subscriptionData: {
        subscriptionBrand: subscriptionBrandSelection,
        subscriptionUrl,
        listingTitle,
        listingDescription,
        numberOfPeople,
        price,
        organizationSelection
      }
    };

    if (!isFormDisabled) {
      basePostRequest(
        "createsubscription",
        postRequestData,
        handleSubmitResponseHandler,
        handleSubmitErrorHandler,
        _userData.user?.auth
      );
    }

    event.preventDefault();
  };

  useEffect(() => {
    retrieveOrganizations();
    retrieveSubscriptionCategories();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    retrieveSubscriptionBrands(subscriptionCategorySelection);
    // eslint-disable-next-line
  }, [subscriptionCategorySelection]);

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
      subscriptionCategories={subscriptionCategories}
      subscriptionBrands={subscriptionBrands}
      organizations={organizations}
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
