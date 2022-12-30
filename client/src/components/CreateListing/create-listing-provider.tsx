import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import CreateListingCanvas from "./create-listing-canvas";
import { FORM_INPUT_TYPE } from "./create-listing-utils";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import {
  baseGetRequest,
  basePostRequest,
  slackPostRequest,
  SLACK_HOOK,
  ERROR_TYPE
} from "./../../base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";
import {
  log,
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
    history.push("/signup");
  }

  var params = new URLSearchParams(location.search);

  const subscriptionIdParam = params.get("id") as string;
  // eslint-disable-next-line
  const [subscriptionId, setSubscriptionId] = useState(
    subscriptionIdParam ?? ""
  );

  const [isUserSelected, setIsUserSelected] = useState(false); // Whether the user has selected a subscription type

  const retrieveSubscriptionResponseHandler = (data: any) => {
    log(data);

    const newSubscriptionData = data?.body?.subscriptionData;
    if (newSubscriptionData) {
      setIsRetrievedListingCreationDataDirty(true);

      log(newSubscriptionData);
      // log(newSubscriptionData.subscriptionBrand.type);
      setSubscriptionCategorySelection(
        newSubscriptionData.subscriptionCategory
      );
      setSubscriptionBrandSelection(newSubscriptionData.subscriptionBrand);
      setOtherSubscription(newSubscriptionData.otherSubscription);
      setListingTitle(newSubscriptionData.listingTitle ?? "");
      setListingDescription(newSubscriptionData.listingDescription ?? "");
      setSubscriptionUrl(newSubscriptionData.subscriptionUrl ?? "");
      setNumberOfPeople(newSubscriptionData.numberOfPeople);
      setPrice(newSubscriptionData.price);
      setNumBedrooms(newSubscriptionData.numBedrooms);
      setNumBathrooms(newSubscriptionData.numBathrooms);

      if (newSubscriptionData.contactFb) {
        setIsContactFb(true);
        setContactFb(newSubscriptionData.contactFb);
      }
      if (newSubscriptionData.contactEmail) {
        setIsContactEmail(true);
        setContactEmail(newSubscriptionData.contactEmail);
      }
    }
  };

  const retrieveSubscriptionErrorHandler = (error: any) => {
    log(error);
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

  const [listingTitle, setListingTitle] = useState("");
  const [listingDescription, setListingDescription] = useState("");

  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [price, setPrice] = useState(0);

  const [numBedrooms, setNumBedrooms] = useState(0);
  const [numBathrooms, setNumBathrooms] = useState(0);

  const [isContactFb, setIsContactFb] = useState(false);
  const [contactFb, setContactFb] = useState("");

  const [isContactEmail, setIsContactEmail] = useState(false);
  const [contactEmail, setContactEmail] = useState("");

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
    const { target } = event;
    const { value, name } = target;

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
      case FORM_INPUT_TYPE.NUM_BEDROOMS:
        setNumBedrooms(value);
        break;
      case FORM_INPUT_TYPE.NUM_BATHROOMS:
        setNumBathrooms(value);
        break;
      case FORM_INPUT_TYPE.CONTACT_FB:
        setContactFb(value);
        break;
      case FORM_INPUT_TYPE.CONTACT_EMAIL:
        setContactEmail(value);
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
      log("User not validated");
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
    log(error);
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
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      log("User not validated");
      history.push("/validate");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
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
    log(error);
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
    log(data);

    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const postRequestData = {
        text: JSON.stringify({
          errorType: ERROR_TYPE.CLIENT,
          type: subscriptionId ? "EDIT_POST" : "NEW_POST",
          userId: _userData.user?.userId,
          subscriptionCategoryId:
            subscriptionCategorySelection?.subscriptionCategoryId,
          subscriptionBrandId: subscriptionBrandSelection?.subscriptionBrandId
        })
      };

      slackPostRequest(SLACK_HOOK.POSTS, postRequestData);

      history.push("/search");
    }
  };

  const handleSubmitErrorHandler = (err: any) => {
    log(err);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const subscriptionData = {
      subscriptionCategory: subscriptionCategorySelection,
      subscriptionBrand: subscriptionBrandSelection,
      subscriptionUrl,
      listingDescription,
      numberOfPeople,
      price
    };

    const postRequestData = { subscriptionData };

    Object.assign(postRequestData.subscriptionData, subscriptionData);

    if (subscriptionId) {
      Object.assign(postRequestData.subscriptionData, { subscriptionId });
    }

    if (isOtherInputDisplayed) {
      Object.assign(postRequestData.subscriptionData, { otherSubscription });
    }

    if (isContactFb && contactFb) {
      Object.assign(postRequestData.subscriptionData, { contactFb });
    }

    if (isContactEmail && contactEmail) {
      Object.assign(postRequestData.subscriptionData, { contactEmail });
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
      setSubscriptionBrandLogo(subscriptionBrandSelection?.logo);
    } else if (Object.keys(subscriptionBrandSelection).length) {
      const brand = subscriptionBrands.find(
        (brand: any) =>
          brand.subscriptionBrandId ===
          subscriptionBrandSelection.subscriptionBrandId
      ) as ISubscriptionBrand;
      setSubscriptionBrandLogo(brand?.logo);
    }

    setIsOtherInputDisplayed(
      subscriptionBrandSelection?.subscriptionBrandId === "OTHER"
    );
    // eslint-disable-next-line
  }, [subscriptionBrandSelection]);

  useEffect(() => {
    setIsSubscriptionUrlValid(!subscriptionUrl || isValidURL(subscriptionUrl));
  }, [subscriptionUrl]);

  useEffect(() => {
    let newIsFormDisabled = !(
      listingDescription &&
      numberOfPeople &&
      price &&
      isSubscriptionUrlValid &&
      (!isOtherInputDisplayed || otherSubscription)
    );

    setIsFormDisabled(newIsFormDisabled);
  }, [
    listingTitle,
    listingDescription,
    numberOfPeople,
    price,
    numBathrooms,
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
      listingTitle={listingTitle}
      listingDescription={listingDescription}
      numberOfPeople={numberOfPeople}
      price={price}
      numBedrooms={numBedrooms}
      numBathrooms={numBathrooms}
      isContactFb={isContactFb}
      setIsContactFb={setIsContactFb}
      contactFb={contactFb}
      isContactEmail={isContactEmail}
      setIsContactEmail={setIsContactEmail}
      contactEmail={contactEmail}
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
