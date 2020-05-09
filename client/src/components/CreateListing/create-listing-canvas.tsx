import React from "react";
import { Link } from "react-router-dom";

import { FORM_INPUT_TYPE } from "./create-listing-utils";
import { ISubscriptionCategory, ISubscriptionBrand } from "./../../utils/utils";

import Tooltip from "@material-ui/core/Tooltip";

interface ICreateListingCanvasProps {
  subscriptionId: string;

  subscriptionCategories: ISubscriptionCategory[];
  subscriptionCategorySelection: ISubscriptionCategory;
  subscriptionBrands: ISubscriptionBrand[];
  subscriptionBrandLogo: string;
  subscriptionBrandSelection: ISubscriptionBrand;
  otherSubscription: string;
  subscriptionUrl: string;
  isDisplaySubscriptionUrlErrorLabel: boolean;

  isOtherInputDisplayed: boolean;

  handleInputChange: (event: React.ChangeEvent<any>) => void;

  listingDescription: string;
  numberOfPeople: number;
  price: number;

  isFormDisabled: boolean;

  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;

  isDescriptionFocused: boolean;
  toggleDescriptionFocused: (value: boolean) => void;
  isNumberOfPeopleFocused: boolean;
  toggleNumberOfPeopleFocused: (value: boolean) => void;
  isPriceFocused: boolean;
  togglePriceFocused: (value: boolean) => void;

  handleOnBlurSubscriptionUrl: () => void;
}

const CreateListingCanvas = (props: ICreateListingCanvasProps) => {
  const {
    subscriptionId,
    subscriptionCategories,
    subscriptionCategorySelection,
    subscriptionBrands,
    subscriptionBrandLogo,
    subscriptionBrandSelection,
    otherSubscription,
    subscriptionUrl,
    isDisplaySubscriptionUrlErrorLabel,
    isOtherInputDisplayed,
    handleInputChange,
    listingDescription,
    numberOfPeople,
    price,
    isFormDisabled,
    handleSubmit,
    isDescriptionFocused,
    toggleDescriptionFocused,
    isNumberOfPeopleFocused,
    toggleNumberOfPeopleFocused,
    isPriceFocused,
    togglePriceFocused,
    handleOnBlurSubscriptionUrl
  } = props;

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
        onChange={handleInputChange}
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
        onChange={handleInputChange}
        value={subscriptionBrandSelection.subscriptionBrandId}
      >
        {options}
      </select>
    );
  };

  const FormLabel = (props: { label: string; isRequired?: boolean }) => {
    const { label, isRequired } = props;
    const className = isRequired ? "form-label required-field" : "form-label";
    return <label className={className}>{label}</label>;
  };

  return (
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
              value={otherSubscription}
              onChange={handleInputChange}
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
              value={listingDescription}
              onChange={handleInputChange}
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
            value={subscriptionUrl}
            onChange={handleInputChange}
            onBlur={handleOnBlurSubscriptionUrl}
          />
          {isDisplaySubscriptionUrlErrorLabel ? (
            <div className="form-error-label">
              Link must be a valid URL or blank
            </div>
          ) : null}
        </div>

        <div className="form-row">
          <div className="form-field">
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
                  value={numberOfPeople || ""}
                  onChange={handleInputChange}
                  style={{ width: 100 }}
                  onFocus={() => toggleNumberOfPeopleFocused(true)}
                  onBlur={() => toggleNumberOfPeopleFocused(false)}
                />
              </Tooltip>
              <span style={{ marginLeft: 10 }}>people</span>
            </div>
          </div>

          <div className="form-field" style={{ marginLeft: 50 }}>
            <FormLabel label={"Price per person:"} isRequired={true} />
            <div className="form-number-input-with-label">
              <Tooltip
                title={"Between $0.01 to $100"}
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
                  placeholder="0.00"
                  value={price || ""}
                  onChange={handleInputChange}
                  style={{ width: 100 }}
                  onFocus={() => togglePriceFocused(true)}
                  onBlur={() => togglePriceFocused(false)}
                />
              </Tooltip>
              <span style={{ marginLeft: 10 }}>$</span>
            </div>
          </div>
        </div>

        <div className="create-listing-edit-footer">
          You can later Edit, Archive, and Delete this listing from your{" "}
          <Link to="/profile">posted listings</Link>
        </div>

        <div
          className="create-listing-edit-footer"
          style={{ fontStyle: "italic", margin: "20px 0 10px 0", fontSize: 14 }}
        >
          WARNING: Not all subscription providers allow sharing of its services.
          It is the user's responsiblity to ensure that their subscription
          listings do not violate their provider's terms of use. PlanShare is
          not responsible for any users that violate agreements with their
          subscription providers.
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
  );
};

export default CreateListingCanvas;
