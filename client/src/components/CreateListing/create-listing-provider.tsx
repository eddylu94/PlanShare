import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import CreateListingCanvas from "./create-listing-canvas";
import { FORM_INPUT_TYPE } from "./create-listing-utils";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";
import { ISubscriptionCategory, ISubscriptionBrand } from "./../../utils/utils";

const CreateListingProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  // Whether at least one request has been executed for listing creation data
  const [
    isRetrievedListingCreationDataDirty,
    setIsRetrievedListingCreationDataDirty
  ] = useState(false);

  const { history } = props;

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  const [subscriptionCategories, setSubscriptionCategories] = useState(
    [] as ISubscriptionCategory[]
  );
  const [
    subscriptionCategorySelection,
    setSubscriptionCategorySelection
  ] = useState({} as ISubscriptionCategory);
  const [subscriptionBrands, setSubscriptionBrands] = useState(
    [] as ISubscriptionBrand[]
  );
  const [subscriptionBrandSelection, setSubscriptionBrandSelection] = useState(
    {} as ISubscriptionBrand
  );
  const [subscriptionUrl, setSubscriptionUrl] = useState("");

  const [subscriptionBrandLogo, setSubscriptionBrandLogo] = useState("");

  const [listingDescription, setListingDescription] = useState("");

  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [price, setPrice] = useState(0);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const [organizations, setOrganizations] = useState([]);
  const [organizationSelection, setOrganizationSelection] = useState({} as any);

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    switch (name) {
      case FORM_INPUT_TYPE.SUBSCRIPTION_TYPE:
        const category = subscriptionCategories.find(
          category => value === category.subscriptionCategoryId
        );
        if (category) {
          setSubscriptionCategorySelection(category);
        }
        break;
      case FORM_INPUT_TYPE.SUBSCRIPTION_BRAND:
        const brand = subscriptionBrands.find(
          brand => value === brand.subscriptionBrandId
        ) as ISubscriptionBrand;
        if (brand) {
          setSubscriptionBrandSelection(brand);
        }
        break;
      case FORM_INPUT_TYPE.SUBSCRIPTION_URL:
        setSubscriptionUrl(value);
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
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      console.log("User not validated");
      history.push("/validate");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;
      setOrganizations(body.organizations);
      setOrganizationSelection(body.defaultOrganization);
      setIsRetrievedListingCreationDataDirty(true);
    }
  };

  const retrieveOrganizationsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptionCategoriesResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      const newDefaultSubscriptionCategory = body.defaultSubscriptionCategory;
      setSubscriptionCategorySelection(newDefaultSubscriptionCategory);

      const newSubscriptionCategories = body.subscriptionCategories;
      setSubscriptionCategories(newSubscriptionCategories);
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

  const retrieveSubscriptionBrandsResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      const subscriptionBrands = body.subscriptionBrands;
      setSubscriptionBrands(subscriptionBrands);

      const newDefaultSubscriptionBrand = body.defaultSubscriptionBrand;
      setSubscriptionBrandSelection(newDefaultSubscriptionBrand);
    }
  };

  const retrieveSubscriptionBrandsErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptionBrands = (selection: string) => {
    baseGetRequest(
      "getsubscriptionbrands",
      [{ subscriptionCategory: selection }],
      retrieveSubscriptionBrandsResponseHandler,
      retrieveSubscriptionBrandsErrorHandler,
      _userData.user?.auth
    );
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

  const handleSubmitResponseHandler = (data: any) => {
    console.log(data);

    if (data.statusCode === STATUS_CODE.SUCCESS) {
      history.push("/search");
    }
  };

  const handleSubmitErrorHandler = (err: any) => {
    console.log(err);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(organizationSelection);
    const postRequestData = {
      subscriptionData: {
        subscriptionBrand: subscriptionBrandSelection,
        subscriptionUrl,
        listingDescription,
        numberOfPeople,
        price,
        organizationId: organizationSelection.organizationId
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
    retrieveSubscriptionBrands(
      subscriptionCategorySelection.subscriptionCategoryId
    );
    // eslint-disable-next-line
  }, [subscriptionCategorySelection]);

  useEffect(() => {
    if (Object.keys(subscriptionBrandSelection).length) {
      const brand = subscriptionBrands.find(
        (brand: any) =>
          brand.subscriptionBrandId ===
          subscriptionBrandSelection.subscriptionBrandId
      ) as ISubscriptionBrand;
      setSubscriptionBrandLogo(brand?.logo);
    }
    // eslint-disable-next-line
  }, [subscriptionBrandSelection]);

  useEffect(() => {
    const newIsFormDisabled = !(
      subscriptionUrl &&
      listingDescription &&
      numberOfPeople &&
      price
    );
    setIsFormDisabled(newIsFormDisabled);
  }, [subscriptionUrl, listingDescription, numberOfPeople, price]);

  return isRetrievedListingCreationDataDirty ? (
    <CreateListingCanvas
      handleInputChange={handleInputChange}
      subscriptionCategories={subscriptionCategories}
      subscriptionCategorySelection={subscriptionCategorySelection}
      subscriptionBrands={subscriptionBrands}
      subscriptionBrandLogo={subscriptionBrandLogo}
      subscriptionBrandSelection={subscriptionBrandSelection}
      organizations={organizations}
      organizationSelection={organizationSelection}
      subscriptionUrl={subscriptionUrl}
      listingDescription={listingDescription}
      numberOfPeople={numberOfPeople}
      price={price}
      isFormDisabled={isFormDisabled}
      handleSubmit={handleSubmit}
    />
  ) : null;
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
