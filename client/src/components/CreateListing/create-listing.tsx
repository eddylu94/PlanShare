import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { FORM_INPUT_TYPE } from "./create-listing-utils";
import { IUserContext, UserDataContext } from "../../user-context-provider";
import {
  baseGetRequest,
  basePostRequest,
  slackPostRequest,
  SLACK_HOOK,
  ERROR_TYPE
} from "../../base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "../../utils/constants";
import {
  log,
  ISubscriptionCategory,
  ISubscriptionBrand,
  isValidURL
} from "../../utils/utils";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { FormControlLabel, Checkbox, Typography } from "@material-ui/core";

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

    const newData = data?.body?.subscriptionData;
    if (newData) {
      setIsRetrievedListingCreationDataDirty(true);
      log(newData);

      setSubscriptionCategorySelection(newData.subscriptionCategory);
      setSubscriptionBrandSelection(newData.subscriptionBrand);

      setFormValues({
        otherSubscription: newData.otherSubscription,
        subscriptionUrl: newData.subscriptionUrl ?? "",
        listingTitle: newData.listingTitle ?? "",
        listingDescription: newData.listingDescription ?? "",
        numberOfPeople: newData.numberOfPeople,
        price: newData.price,
        ...(newData.contactFb && {
          isContactFb: newData.isContactFb,
          contactFb: newData.contactFb
        }),
        ...(newData.contactEmail && {
          isContactEmail: true,
          contactEmail: newData.contactEmail
        })
      });
    }
  };

  const retrieveSubscription = () => {
    baseGetRequest(
      "getsubscription",
      [{ subscriptionId }],
      retrieveSubscriptionResponseHandler,
      log,
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
    [] as Array<ISubscriptionBrand>
  );
  const [subscriptionBrandSelection, setSubscriptionBrandSelection] = useState(
    {} as ISubscriptionBrand
  );

  const [isOtherInputDisplayed, setIsOtherInputDisplayed] = useState(false);

  const [formValues, setFormValues] = useState({
    otherSubscription: "",
    subscriptionUrl: "",
    listingTitle: "",
    listingDescription: "",
    numberOfPeople: 0,
    price: 0,
    isContactFb: false,
    contactFb: "",
    isContactEmail: false,
    contactEmail: ""
  });

  const [subscriptionBrandLogo, setSubscriptionBrandLogo] = useState("");

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isNumberOfPeopleFocused, setIsNumberOfPeopleFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  const [isSubscriptionUrlValid, setIsSubscriptionUrlValid] = useState(true);
  const [
    isDisplaySubscriptionUrlErrorLabel,
    setIsDisplaySubscriptionUrlErrorLabel
  ] = useState(false);

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

  const retrieveSubscriptionCategories = () => {
    baseGetRequest(
      "getsubscriptioncategories",
      [],
      retrieveSubscriptionCategoriesResponseHandler,
      log,
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

  const retrieveSubscriptionBrands = (selection: string) => {
    baseGetRequest(
      "getsubscriptionbrands",
      [{ subscriptionCategory: selection }],
      retrieveSubscriptionBrandsResponseHandler,
      log,
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const subscriptionData = {
      subscriptionCategory: subscriptionCategorySelection,
      subscriptionBrand: subscriptionBrandSelection,
      subscriptionUrl: formValues.subscriptionUrl,
      listingDescription: formValues.listingDescription,
      numberOfPeople: formValues.numberOfPeople,
      price: formValues.price
    };

    const postRequestData = { subscriptionData };

    Object.assign(postRequestData.subscriptionData, subscriptionData);

    if (subscriptionId) {
      Object.assign(postRequestData.subscriptionData, { subscriptionId });
    }

    if (isOtherInputDisplayed) {
      Object.assign(postRequestData.subscriptionData, {
        otherSubscription: formValues.otherSubscription
      });
    }

    if (formValues.isContactFb && formValues.contactFb) {
      Object.assign(postRequestData.subscriptionData, {
        contactFb: formValues.contactFb
      });
    }

    if (formValues.isContactEmail && formValues.contactEmail) {
      Object.assign(postRequestData.subscriptionData, {
        contactEmail: formValues.contactEmail
      });
    }

    if (!isFormDisabled) {
      if (subscriptionId) {
        basePostRequest(
          "editsubscription",
          postRequestData,
          handleSubmitResponseHandler,
          log,
          _userData.user?.auth
        );
      } else {
        basePostRequest(
          "createsubscription",
          postRequestData,
          handleSubmitResponseHandler,
          log,
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
    setIsSubscriptionUrlValid(
      !formValues.subscriptionUrl || isValidURL(formValues.subscriptionUrl)
    );
  }, [formValues.subscriptionUrl]);

  useEffect(() => {
    const newIsFormDisabled = !(
      formValues.listingDescription &&
      formValues.numberOfPeople &&
      formValues.price &&
      isSubscriptionUrlValid &&
      (!isOtherInputDisplayed || formValues.otherSubscription)
    );

    setIsFormDisabled(newIsFormDisabled);
  }, [
    formValues.listingTitle,
    formValues.listingDescription,
    formValues.numberOfPeople,
    formValues.price,
    formValues.otherSubscription,
    isSubscriptionUrlValid,
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
      !!formValues.subscriptionUrl && !isSubscriptionUrlValid
    );
  };

  const renderSubscriptionCategoryDropdown = () => {
    if (
      !(
        subscriptionCategories &&
        Object.keys(subscriptionCategories).length &&
        subscriptionCategorySelection
      )
    ) {
      return null;
    }

    const options = subscriptionCategories.map((category, i) => (
      <option
        key={"subscription-type-" + i}
        value={category.subscriptionCategoryId}
      >
        {category.name}
      </option>
    ));
    return (
      <select
        className="form-text-input form-input select-input"
        name={FORM_INPUT_TYPE.SUBSCRIPTION_TYPE}
        onChange={e => {
          const category = subscriptionCategories.find(
            category => e.target.value === category.subscriptionCategoryId
          );
          if (category) {
            setIsUserSelected(true);
            setSubscriptionCategorySelection(category);
          }
        }}
        value={subscriptionCategorySelection.subscriptionCategoryId}
      >
        {options}
      </select>
    );
  };

  const renderSubscriptionBrandDropdown = () => {
    if (!(subscriptionBrands && subscriptionBrands.length)) {
      return null;
    }

    const options = subscriptionBrands.map((subscriptionBrand, i) => (
      <option
        key={"subscription-brand-" + i}
        value={subscriptionBrand.subscriptionBrandId}
      >
        {subscriptionBrand.name}
      </option>
    ));
    return (
      <select
        className="form-text-input form-input select-input required-field"
        name={FORM_INPUT_TYPE.SUBSCRIPTION_BRAND}
        onChange={e => {
          const brand = subscriptionBrands.find(
            brand => e.target.value === brand.subscriptionBrandId
          );
          if (brand) {
            setSubscriptionBrandSelection(brand);
          }
        }}
        value={subscriptionBrandSelection.subscriptionBrandId}
      >
        {options}
      </select>
    );
  };

  const FormLabel = (props: { label: string; isRequired?: boolean }) => (
    <label
      className={props.isRequired ? "form-label required-field" : "form-label"}
    >
      {props.label}
    </label>
  );

  return isRetrievedListingCreationDataDirty ? (
    <div className="page-container" style={{ alignItems: "center" }}>
      <form className="form-container" onSubmit={handleSubmit} noValidate>
        <h2 className="form-header">
          {subscriptionId ? "Edit Listing" : "Create Listing"}
        </h2>

        <div className="subscription-fields">
          <div className="form-field">
            <FormLabel label={"Subscription type:"} isRequired={true} />
            {renderSubscriptionCategoryDropdown()}
          </div>

          <div className="subscription-field-and-logo">
            <div className="form-field subscription-field">
              <FormLabel label={"Subscription:"} isRequired={true} />
              {renderSubscriptionBrandDropdown()}
            </div>

            <img
              alt="Subscription logo"
              className="create-listing-subscription-logo"
              src={subscriptionBrandLogo}
            />
          </div>
        </div>

        {isOtherInputDisplayed ? (
          <div className="form-field">
            <FormLabel label={"If other, please specify:"} isRequired={true} />
            <input
              className="form-text-input form-input"
              name={FORM_INPUT_TYPE.OTHER_SUBSCRIPTION}
              type="text"
              placeholder="Custom subscription"
              value={formValues.otherSubscription}
              onChange={e =>
                setFormValues({
                  ...formValues,
                  otherSubscription: e.target.value
                })
              }
              onBlur={handleOnBlurSubscriptionUrl}
              style={{ width: 300 }}
            />
          </div>
        ) : null}

        <div className="form-field">
          <FormLabel label={"Listing description:"} isRequired={true} />
          <Tooltip
            title={"Max 750 characters"}
            aria-label="Max 750 characters"
            placement="bottom-start"
            open={isDescriptionFocused}
          >
            <textarea
              className="form-text-area form-input"
              name={FORM_INPUT_TYPE.LISTING_DESCRIPTION}
              rows={5}
              placeholder="Currently have two people, need three more!"
              value={formValues.listingDescription}
              onChange={e =>
                setFormValues({
                  ...formValues,
                  listingDescription: e.target.value
                })
              }
              onFocus={() => toggleDescriptionFocused(true)}
              onBlur={() => toggleDescriptionFocused(false)}
              maxLength={750}
            />
          </Tooltip>
        </div>

        <div className="form-field">
          <FormLabel label={"Link to subscription (optional):"} />
          <input
            className="form-text-input form-input"
            name={FORM_INPUT_TYPE.SUBSCRIPTION_URL}
            type="text"
            placeholder="https://example.com/"
            value={formValues.subscriptionUrl}
            onChange={e =>
              setFormValues({
                ...formValues,
                subscriptionUrl: e.target.value
              })
            }
            onBlur={handleOnBlurSubscriptionUrl}
          />
          {isDisplaySubscriptionUrlErrorLabel ? (
            <div className="form-error-label">
              Link must be a valid URL or blank
            </div>
          ) : null}
        </div>

        <div className="form-row">
          <div className="form-field" style={{ marginRight: 50 }}>
            <FormLabel label={"Looking for:"} isRequired={true} />
            <div className="form-number-input-with-label">
              <Tooltip
                title={"Between 1 to 50 people per group"}
                aria-label="add"
                placement="bottom-start"
                open={isNumberOfPeopleFocused}
              >
                <input
                  className="form-text-input form-input form-number-input"
                  name={FORM_INPUT_TYPE.NUMBER_OF_PEOPLE}
                  type="number"
                  min="1"
                  max="50"
                  placeholder="0"
                  value={formValues.numberOfPeople || ""}
                  onChange={e =>
                    setFormValues({
                      ...formValues,
                      numberOfPeople: e.target.value as any
                    })
                  }
                  style={{ width: 100 }}
                  onFocus={() => toggleNumberOfPeopleFocused(true)}
                  onBlur={() => toggleNumberOfPeopleFocused(false)}
                />
              </Tooltip>
              <span style={{ marginLeft: 10 }}>people</span>
            </div>
          </div>

          <div className="form-field">
            <FormLabel label="Price per person:" isRequired={true} />
            <div className="form-number-input-with-label">
              <Tooltip
                title="Between $0.01 to $100"
                aria-label="add"
                placement="bottom-start"
                open={isPriceFocused}
              >
                <input
                  className="form-text-input form-input form-number-input"
                  name={FORM_INPUT_TYPE.PRICE}
                  type="number"
                  min="0.01"
                  step="0.01"
                  max="100"
                  placeholder="0"
                  value={formValues.price || ""}
                  onChange={e =>
                    setFormValues({
                      ...formValues,
                      price: e.target.value as any
                    })
                  }
                  style={{ width: 100 }}
                  onFocus={() => togglePriceFocused(true)}
                  onBlur={() => togglePriceFocused(false)}
                />
              </Tooltip>
              <span style={{ marginLeft: 10 }}>$</span>
            </div>
          </div>
        </div>

        <div className="create-listing-contact">
          <FormLabel
            label={
              "Users may also reach out to me about this listing by (optional):"
            }
          />

          <FormControlLabel
            key={"filters-category-fb"}
            style={{ color: "#000000", marginTop: 10 }}
            control={
              <Checkbox
                checked={formValues.isContactFb}
                // TODO: Remove lambda expression
                onChange={e =>
                  setFormValues({
                    ...formValues,
                    isContactFb: !formValues.isContactFb
                  })
                }
                name={"contact-fb"}
                style={{
                  padding: 0,
                  margin: "5px 5px 5px 20px",
                  color: "#6C5DBD"
                }}
              />
            }
            label={
              <div className="flex-horizontal-centered">
                <Typography
                  style={{ fontSize: 15, marginRight: 10, minWidth: 80 }}
                >
                  Facebook
                </Typography>
                <input
                  className="form-text-input form-input"
                  name={FORM_INPUT_TYPE.CONTACT_FB}
                  type="text"
                  placeholder="Username"
                  value={formValues.contactFb}
                  onChange={e =>
                    setFormValues({
                      ...formValues,
                      contactFb: e.target.value
                    })
                  }
                  onBlur={handleOnBlurSubscriptionUrl}
                />
              </div>
            }
          />

          <FormControlLabel
            key={"filters-category-email"}
            style={{ color: "#000000", marginTop: 10 }}
            control={
              <Checkbox
                checked={formValues.isContactEmail}
                // TODO: Remove lambda expression
                onChange={e =>
                  setFormValues({
                    ...formValues,
                    isContactEmail: !formValues.isContactEmail
                  })
                }
                name={"contact-email"}
                style={{
                  padding: 0,
                  margin: "5px 5px 5px 20px",
                  color: "#6C5DBD"
                }}
              />
            }
            label={
              <div className="flex-horizontal-centered">
                <Typography
                  style={{ fontSize: 15, marginRight: 10, minWidth: 80 }}
                >
                  Email
                </Typography>
                <input
                  className="form-text-input form-input"
                  name={FORM_INPUT_TYPE.CONTACT_EMAIL}
                  type="text"
                  placeholder="Email address"
                  value={formValues.contactEmail}
                  onChange={e =>
                    setFormValues({
                      ...formValues,
                      contactEmail: e.target.value
                    })
                  }
                  onBlur={handleOnBlurSubscriptionUrl}
                />
              </div>
            }
          />
        </div>

        <div className="create-listing-edit-footer">
          You can later Edit, Archive, and Delete this listing from your{" "}
          <Link to="/profile">posted listings</Link>
        </div>

        <div className="create-listing-edit-footer create-listing-edit-footer-disclaimer">
          WARNING:{" "}
          <Link to="/info" target="_blank" rel="noopener noreferrer">
            Certain subscription providers
          </Link>{" "}
          restrict sharing of their services. It is the user's responsiblity to
          ensure that their subscription listings do not violate their
          provider's terms of use.
        </div>

        <input
          className="form-submit-button"
          type="submit"
          value="Submit"
          style={{ marginTop: 20 }}
          disabled={isFormDisabled}
        />
      </form>
    </div>
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
