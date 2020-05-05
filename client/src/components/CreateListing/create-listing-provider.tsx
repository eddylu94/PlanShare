import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import CreateListingCanvas from "./create-listing-canvas";
import { FORM_INPUT_TYPE } from "./create-listing-utils";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";
import {
  ISubscriptionCategory,
  ISubscriptionBrand,
  isValidURL
} from "./../../utils/utils";

const CreateListingProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
  location: Location;
}) => {
  const _userData = props.userData;

  // Whether at least one request has been executed for listing creation data
  const [
    isRetrievedListingCreationDataDirty,
    setIsRetrievedListingCreationDataDirty
  ] = useState(false);

  const { history, location } = props;

  if (!_userData.user?.auth) {
    history.push("/login");
  }

  var params = new URLSearchParams(location.search);

  const subscriptionIdParam = params.get("id") as string;
  // eslint-disable-next-line
  const [subscriptionId, setSubscriptionId] = useState(
    subscriptionIdParam ?? ""
  );

  const [isUserSelected, setIsUserSelected] = useState(false); // Whether the user has selected a subscription type

  const retrieveSubscriptionResponseHandler = (data: any) => {
    console.log(data);

    const newSubscriptionData = data?.body?.subscriptionData;
    if (newSubscriptionData) {
      setIsRetrievedListingCreationDataDirty(true);

      console.log(newSubscriptionData);
      console.log(newSubscriptionData.subscriptionBrand.type);
      setSubscriptionCategorySelection(
        newSubscriptionData.subscriptionCategory
      );
      setSubscriptionBrandSelection(newSubscriptionData.subscriptionBrand);
      setOtherSubscription(newSubscriptionData.otherSubscription);
      setListingDescription(newSubscriptionData.listingDescription);
      setSubscriptionUrl(newSubscriptionData.subscriptionUrl);
      setNumberOfPeople(newSubscriptionData.numberOfPeople);
      setPrice(newSubscriptionData.price);
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
    if (subscriptionId) {
      retrieveSubscription();
    }
    // eslint-disable-next-line
  }, [subscriptionId]);

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

  const [otherSubscription, setOtherSubscription] = useState("");

  const [isOtherInputDisplayed, setIsOtherInputDisplayed] = useState(false);

  const [subscriptionUrl, setSubscriptionUrl] = useState("");

  const [subscriptionBrandLogo, setSubscriptionBrandLogo] = useState("");

  const [listingDescription, setListingDescription] = useState("");

  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [price, setPrice] = useState(0);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isNumberOfPeopleFocused, setIsNumberOfPeopleFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  const [isSubscriptionUrlValid, setIsSubscriptionUrlValid] = useState(true);
  const [
    isDisplaySubscriptionUrlErrorLabel,
    setIsDisplaySubscriptionUrlErrorLabel
  ] = useState(false);

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
          setIsUserSelected(true);
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
      case FORM_INPUT_TYPE.OTHER_SUBSCRIPTION:
        setOtherSubscription(value);
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

  const retrieveSubscriptionCategoriesResponseHandler = (data: any) => {
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      console.log("User not validated");
      history.push("/validate");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      if (!subscriptionId) {
        const newDefaultSubscriptionCategory = body.defaultSubscriptionCategory;
        setSubscriptionCategorySelection(newDefaultSubscriptionCategory);
      }

      const newSubscriptionCategories = body.subscriptionCategories;
      setSubscriptionCategories(newSubscriptionCategories);

      setIsRetrievedListingCreationDataDirty(true);
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

      if (!(subscriptionId && !isUserSelected)) {
        const newDefaultSubscriptionBrand = body.defaultSubscriptionBrand;
        setSubscriptionBrandSelection(newDefaultSubscriptionBrand);
      }
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
    const postRequestData = {
      subscriptionData: {
        subscriptionCategory: subscriptionCategorySelection,
        subscriptionBrand: subscriptionBrandSelection,
        subscriptionUrl,
        listingDescription,
        numberOfPeople,
        price
      }
    };

    console.log(subscriptionId);
    if (subscriptionId) {
      Object.assign(postRequestData.subscriptionData, { subscriptionId });
    }

    if (isOtherInputDisplayed) {
      Object.assign(postRequestData.subscriptionData, { otherSubscription });
    }

    if (!isFormDisabled) {
      if (subscriptionId) {
        basePostRequest(
          "editsubscription",
          postRequestData,
          handleSubmitResponseHandler,
          handleSubmitErrorHandler,
          _userData.user?.auth
        );
      } else {
        basePostRequest(
          "createsubscription",
          postRequestData,
          handleSubmitResponseHandler,
          handleSubmitErrorHandler,
          _userData.user?.auth
        );
      }
    }

    event.preventDefault();
  };

  useEffect(() => {
    retrieveSubscriptionCategories();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      subscriptionCategorySelection &&
      Object.keys(subscriptionCategorySelection).length
    ) {
      retrieveSubscriptionBrands(
        subscriptionCategorySelection.subscriptionCategoryId
      );
    }
    // eslint-disable-next-line
  }, [subscriptionCategorySelection]);

  useEffect(() => {
    const subscriptionIdParam = params.get("id") as string;

    if (subscriptionIdParam) {
      setSubscriptionBrandLogo(subscriptionBrandSelection.logo);
    } else if (Object.keys(subscriptionBrandSelection).length) {
      const brand = subscriptionBrands.find(
        (brand: any) =>
          brand.subscriptionBrandId ===
          subscriptionBrandSelection.subscriptionBrandId
      ) as ISubscriptionBrand;
      setSubscriptionBrandLogo(brand?.logo);
    }

    setIsOtherInputDisplayed(
      subscriptionBrandSelection.subscriptionBrandId === "OTHER"
    );
    // eslint-disable-next-line
  }, [subscriptionBrandSelection]);

  useEffect(() => {
    setIsSubscriptionUrlValid(!subscriptionUrl || isValidURL(subscriptionUrl));
  }, [subscriptionUrl]);

  useEffect(() => {
    const newIsFormDisabled = !(
      listingDescription &&
      numberOfPeople &&
      price &&
      isSubscriptionUrlValid &&
      (!isOtherInputDisplayed || otherSubscription)
    );
    setIsFormDisabled(newIsFormDisabled);
  }, [
    listingDescription,
    numberOfPeople,
    price,
    isSubscriptionUrlValid,
    otherSubscription,
    isOtherInputDisplayed
  ]);

  const toggleDescriptionFocused = (value: boolean) => {
    setIsDescriptionFocused(value);
  };

  const toggleNumberOfPeopleFocused = (value: boolean) => {
    setIsNumberOfPeopleFocused(value);
  };

  const togglePriceFocused = (value: boolean) => {
    setIsPriceFocused(value);
  };

  const handleOnBlurSubscriptionUrl = () => {
    setIsDisplaySubscriptionUrlErrorLabel(
      !!subscriptionUrl && !isSubscriptionUrlValid
    );
  };

  return isRetrievedListingCreationDataDirty ? (
    <CreateListingCanvas
      subscriptionId={subscriptionId}
      handleInputChange={handleInputChange}
      subscriptionCategories={subscriptionCategories}
      subscriptionCategorySelection={subscriptionCategorySelection}
      subscriptionBrands={subscriptionBrands}
      subscriptionBrandLogo={subscriptionBrandLogo}
      subscriptionBrandSelection={subscriptionBrandSelection}
      otherSubscription={otherSubscription}
      subscriptionUrl={subscriptionUrl}
      isOtherInputDisplayed={isOtherInputDisplayed}
      isDisplaySubscriptionUrlErrorLabel={isDisplaySubscriptionUrlErrorLabel}
      listingDescription={listingDescription}
      numberOfPeople={numberOfPeople}
      price={price}
      isFormDisabled={isFormDisabled}
      handleSubmit={handleSubmit}
      isDescriptionFocused={isDescriptionFocused}
      toggleDescriptionFocused={toggleDescriptionFocused}
      isNumberOfPeopleFocused={isNumberOfPeopleFocused}
      toggleNumberOfPeopleFocused={toggleNumberOfPeopleFocused}
      isPriceFocused={isPriceFocused}
      togglePriceFocused={togglePriceFocused}
      handleOnBlurSubscriptionUrl={handleOnBlurSubscriptionUrl}
    />
  ) : null;
};

const CreateListingProvider = (props: { history: History; location: any }) => (
  <UserDataContext.Consumer>
    {userData => (
      <CreateListingProviderWithContext
        userData={userData}
        history={props.history}
        location={props.location}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(CreateListingProvider);
