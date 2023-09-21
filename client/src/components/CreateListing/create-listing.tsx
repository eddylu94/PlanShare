// Third-party libraries
import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { History } from "history";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// API
import {
  baseGetRequest,
  basePostRequest,
  slackPostRequest,
  SLACK_HOOK,
  ERROR_TYPE
} from "base-requests";

// Utilities
import { IUserContext, UserDataContext } from "user-context-provider";
import { STATUS_CODE, STATUS_MESSAGE } from "@utils/constants";
import {
  log,
  ISubscriptionCategory,
  ISubscriptionBrand,
  isValidURL
} from "@utils/utils";

const CreateListingProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
  location: Location;
}) => {
  const { history, location, userData: _userData } = props;

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  const params = new URLSearchParams(location.search);
  const subscriptionId = params.get("id") as string;

  // Whether at least one request has been executed for listing creation data
  const [
    isRetrievedListingCreationDataDirty,
    setIsRetrievedListingCreationDataDirty
  ] = useState(false);

  // Whether the user has selected a subscription type
  const [isUserSelected, setIsUserSelected] = useState(false);

  // Subscription fields
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
  const [subscriptionBrandLogo, setSubscriptionBrandLogo] = useState("");

  // Form validation
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isSubscriptionUrlValid, setIsSubscriptionUrlValid] = useState(true);
  const [
    isDisplaySubscriptionUrlErrorLabel,
    setIsDisplaySubscriptionUrlErrorLabel
  ] = useState(false);

  const [formValues, setFormValues] = useState({
    otherSubscription: "",
    subscriptionUrl: "",
    listingTitle: "",
    listingDescription: "",
    price: 0
  });

  const retrieveSubscriptionResponseHandler = (data: any) => {
    log(data);

    const newData = data?.body?.subscriptionData;
    if (newData) {
      setIsRetrievedListingCreationDataDirty(true);
      setSubscriptionCategorySelection(newData.subscriptionCategory);
      setSubscriptionBrandSelection(newData.subscriptionBrand);
      setFormValues({
        otherSubscription: newData.otherSubscription,
        subscriptionUrl: newData.subscriptionUrl ?? "",
        listingTitle: newData.listingTitle ?? "",
        listingDescription: newData.listingDescription ?? "",
        price: newData.price
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

  const retrieveSubscriptionCategoriesResponseHandler = (data: any) => {
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      log("User not validated");
      history.push("/validate");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      const { body } = data;

      if (!subscriptionId) {
        const newDefaultSubscriptionCategory = body.defaultSubscriptionCategory;
        setSubscriptionCategorySelection(newDefaultSubscriptionCategory);
      }

      setIsRetrievedListingCreationDataDirty(true);

      const newSubscriptionCategories = body.subscriptionCategories;
      setSubscriptionCategories(newSubscriptionCategories);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const subscriptionData = {
      subscriptionCategory: subscriptionCategorySelection,
      subscriptionBrand: subscriptionBrandSelection,
      subscriptionUrl: formValues.subscriptionUrl,
      listingDescription: formValues.listingDescription,
      price: formValues.price,
      ...(subscriptionId && { subscriptionId }),
      ...(isOtherInputDisplayed && {
        otherSubscription: formValues.otherSubscription
      })
    };

    if (!isFormDisabled) {
      basePostRequest(
        subscriptionId ? "editsubscription" : "createsubscription",
        { subscriptionData },
        handleSubmitResponseHandler,
        log,
        _userData.user?.auth
      );
    }

    e.preventDefault();
  };

  useEffect(() => {
    setIsDisplaySubscriptionUrlErrorLabel(
      !!formValues.subscriptionUrl && !isSubscriptionUrlValid
    );
  }, [formValues.subscriptionUrl, isSubscriptionUrlValid]);

  useEffect(() => {
    retrieveSubscriptionCategories();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      subscriptionCategorySelection != null &&
      Object.keys(subscriptionCategorySelection).length > 0
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
    } else if (Object.keys(subscriptionBrandSelection).length > 0) {
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
      (formValues.price ||
        subscriptionCategorySelection.subscriptionCategoryId === "REFERRALS") &&
      (!isOtherInputDisplayed || formValues.otherSubscription) &&
      isSubscriptionUrlValid
    );

    setIsFormDisabled(newIsFormDisabled);
  }, [
    subscriptionCategorySelection.subscriptionCategoryId,
    formValues.listingTitle,
    formValues.listingDescription,
    formValues.price,
    formValues.otherSubscription,
    isOtherInputDisplayed,
    isSubscriptionUrlValid
  ]);

  const renderSubscriptionCategoryDropdown = () => {
    if (
      !(
        subscriptionCategories &&
        Object.keys(subscriptionCategories).length > 0 &&
        subscriptionCategorySelection
      )
    ) {
      return null;
    }

    const options = subscriptionCategories.map((category, i) => ({
      label: category.name
    }));

    return (
      <Autocomplete
        disablePortal
        disableClearable
        options={options.map(option => option.label)}
        onChange={(_e, value) => {
          const category = subscriptionCategories.find(
            category => value === category.name
          );
          if (category) {
            setIsUserSelected(true);
            setSubscriptionCategorySelection(category);
          }
        }}
        value={subscriptionCategorySelection.name}
        renderInput={params => <TextField {...params} placeholder="Category" />}
      />
    );
  };

  const renderSubscriptionBrandDropdown = () => {
    if (!(subscriptionBrands?.length > 0)) {
      return null;
    }

    const options = subscriptionBrands.map(subscriptionBrand => ({
      label: subscriptionBrand.name
    }));

    return (
      <Autocomplete
        disablePortal
        disableClearable
        options={options.map(option => option.label)}
        onChange={(_e, value) => {
          const brand = subscriptionBrands.find(brand => value === brand.name);
          if (brand) {
            setSubscriptionBrandSelection(brand);
          }
        }}
        value={subscriptionBrandSelection.name}
        renderInput={params => <TextField {...params} placeholder="Service" />}
      />
    );
  };

  const FormLabel = (props: { label: string; isRequired?: boolean }) => (
    <label
      className={props.isRequired ? "form-label required-field" : "form-label"}
    >
      {props.label}
    </label>
  );

  const isCardReferral = [
    "CHASE_SAPPHIRE_RESERVE_REFERRAL",
    "AMEX_PLATINUM_REFERRAL"
  ].includes(subscriptionBrandSelection.subscriptionBrandId);

  return isRetrievedListingCreationDataDirty ? (
    <div className="page-container" style={{ alignItems: "center" }}>
      <form className="form-container" onSubmit={handleSubmit} noValidate>
        <h2 className="form-header">
          {subscriptionId ? "Edit Listing" : "Create Listing"}
        </h2>

        <div className="subscription-fields">
          <div className="form-field">
            <FormLabel label="Category:" isRequired />
            {renderSubscriptionCategoryDropdown()}
          </div>

          <div className="subscription-field-and-logo">
            {/* TODO: Replace "marginLeft: 0" with proper CSS styling */}
            <div
              className="form-field subscription-field"
              style={{ marginLeft: 0, width: "100%" }}
            >
              <FormLabel label="Service:" isRequired />
              {renderSubscriptionBrandDropdown()}
            </div>

            <img
              alt="Subscription logo"
              className={
                isCardReferral
                  ? "create-listing-subscription-card-referral-logo"
                  : "create-listing-subscription-logo"
              }
              src={subscriptionBrandLogo}
            />
          </div>
        </div>

        {isOtherInputDisplayed && (
          <div className="form-field">
            <FormLabel label={"If other, please specify:"} isRequired />
            <TextField
              value={formValues.otherSubscription}
              onChange={e =>
                setFormValues({
                  ...formValues,
                  otherSubscription: e.target.value
                })
              }
            />
          </div>
        )}

        <div className="form-field">
          <FormLabel label="Listing description:" isRequired />
          <TextField
            multiline
            rows={5}
            placeholder="Currently have two people, need three more!"
            value={formValues.listingDescription}
            onChange={e =>
              setFormValues({
                ...formValues,
                listingDescription: e.target.value
              })
            }
          />
        </div>

        <div className="form-field">
          <FormLabel label={"Link to subscription (optional):"} />
          <TextField
            value={formValues.subscriptionUrl}
            onChange={e =>
              setFormValues({
                ...formValues,
                subscriptionUrl: e.target.value
              })
            }
            placeholder="https://example.com/"
            error={isDisplaySubscriptionUrlErrorLabel}
            helperText={
              isDisplaySubscriptionUrlErrorLabel
                ? "Link must be a valid URL or blank"
                : undefined
            }
          />
        </div>

        {subscriptionCategorySelection.subscriptionCategoryId !==
          "REFERRALS" && (
          <div className="form-row">
            <div className="form-field">
              <FormLabel label="Price per person:" isRequired />
              <div className="form-number-input-with-label">
                <TextField
                  value={formValues.price}
                  onChange={e =>
                    setFormValues({
                      ...formValues,
                      price: e.target.value as any
                    })
                  }
                  type="number"
                  placeholder="0"
                  style={{ width: 100 }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  // helperText='Between $0.01 to $100'
                />
                <span style={{ marginLeft: 10 }}>$</span>
              </div>
            </div>
          </div>
        )}

        <div className="create-listing-edit-footer">
          You can later Edit, Archive, and Delete this listing from your{" "}
          <Link to="/profile">posted listings</Link>
        </div>

        {["ONLINE_STREAMING", "MUSIC_SERVICE"].includes(
          subscriptionCategorySelection.subscriptionCategoryId
        ) && (
          <div className="create-listing-edit-footer create-listing-edit-footer-disclaimer">
            WARNING:{" "}
            <Link to="/info" target="_blank" rel="noopener noreferrer">
              Certain subscription providers
            </Link>{" "}
            restrict sharing of their services. It is the user's responsiblity
            to ensure that their subscription listings do not violate their
            provider's terms of use.
          </div>
        )}

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
