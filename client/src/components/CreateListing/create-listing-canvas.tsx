import React from "react";
import { Link } from "react-router-dom";

import { FORM_INPUT_TYPE } from "./create-listing-utils";
import { ISubscriptionCategory, ISubscriptionBrand } from "./../../utils/utils";

import Tooltip from "@material-ui/core/Tooltip";
import { FormControlLabel, Checkbox, Typography } from "@material-ui/core";
import { LISTING_TYPE } from "../../utils/constants";

interface ICreateListingCanvasProps {
  listingType: string;
  setListingType: (value: string) => void;

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

  listingTitle: string;
  listingDescription: string;
  numberOfPeople: number;
  price: number;
  numBedrooms: number;
  numBathrooms: number;

  isContactFb: boolean;
  setIsContactFb: (value: boolean) => void;
  contactFb: string;

  isContactEmail: boolean;
  setIsContactEmail: (value: boolean) => void;
  contactEmail: string;

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
    listingType,
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
    listingTitle,
    listingDescription,
    numberOfPeople,
    price,
    numBedrooms,
    numBathrooms,
    isContactFb,
    setIsContactFb,
    contactFb,
    isContactEmail,
    setIsContactEmail,
    contactEmail,
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

  let priceLabel;

  switch (listingType) {
    case LISTING_TYPE.SUBSCRIPTION:
      priceLabel = "Price per person:";
      break;
    case LISTING_TYPE.HOUSING:
      priceLabel = "Monthly rent:";
      break;
    case LISTING_TYPE.FOR_SALE:
    default:
      priceLabel = "Price:";
      break;
  }

  return (
    <div className="page-container" style={{ alignItems: "center" }}>
      <form className="form-container" onSubmit={handleSubmit} noValidate>
        <h2 className="form-header">
          {subscriptionId ? "Edit Listing" : "Create Listing"}
        </h2>

        {listingType === LISTING_TYPE.SUBSCRIPTION ? (
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
        ) : null}

        {listingType === LISTING_TYPE.FOR_SALE || LISTING_TYPE.HOUSING ? (
          <div className="subscription-fields">
            <div className="form-field">
              <FormLabel label={"Listing title:"} isRequired={true} />
              <input
                className="form-text-input form-input"
                name={FORM_INPUT_TYPE.LISTING_TITLE}
                type="text"
                placeholder={
                  listingType === LISTING_TYPE.FOR_SALE
                    ? "Hand sanitizer"
                    : "Room for rent"
                }
                value={listingTitle}
                onChange={handleInputChange}
                onBlur={handleOnBlurSubscriptionUrl}
                style={{ width: 300 }}
              />
            </div>
          </div>
        ) : null}

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

        {listingType === LISTING_TYPE.SUBSCRIPTION ? (
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
        ) : null}

        {listingType === LISTING_TYPE.HOUSING ? (
          <div className="form-row">
            <div className="form-field" style={{ marginRight: 20 }}>
              <FormLabel label={"Bedrooms:"} isRequired={true} />
              <div className="form-number-input-with-label">
                <input
                  className="form-text-input form-input form-number-input"
                  name={FORM_INPUT_TYPE.NUM_BEDROOMS}
                  type="number"
                  min={"0"}
                  step={"1"}
                  max={"10"}
                  placeholder="0"
                  value={numBedrooms || ""}
                  onChange={handleInputChange}
                  style={{ width: 100 }}
                  onFocus={() => togglePriceFocused(true)}
                  onBlur={() => togglePriceFocused(false)}
                />
              </div>
            </div>

            <div className="form-field">
              <FormLabel label={"Bathrooms:"} isRequired={true} />
              <div className="form-number-input-with-label">
                <input
                  className="form-text-input form-input form-number-input"
                  name={FORM_INPUT_TYPE.NUM_BATHROOMS}
                  type="number"
                  min={"1"}
                  step={"1"}
                  max={"10"}
                  placeholder="0"
                  value={numBathrooms || ""}
                  onChange={handleInputChange}
                  style={{ width: 100 }}
                  onFocus={() => togglePriceFocused(true)}
                  onBlur={() => togglePriceFocused(false)}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="form-row">
          {listingType === LISTING_TYPE.SUBSCRIPTION ? (
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
          ) : null}

          <div className="form-field">
            <FormLabel label={priceLabel} isRequired={true} />
            <div className="form-number-input-with-label">
              <Tooltip
                title={
                  listingType === LISTING_TYPE.HOUSING
                    ? "Between $1 to $5000"
                    : "Between $0.01 to $100"
                }
                aria-label="add"
                placement="bottom-start"
                open={isPriceFocused}
              >
                <input
                  className="form-text-input form-input form-number-input"
                  name={FORM_INPUT_TYPE.PRICE}
                  type="number"
                  min={listingType === LISTING_TYPE.HOUSING ? "1" : "0.01"}
                  step={listingType === LISTING_TYPE.HOUSING ? "1" : "0.01"}
                  max={listingType === LISTING_TYPE.HOUSING ? "5000" : "100"}
                  placeholder="0"
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
                checked={isContactFb}
                // TODO: Remove lambda expression
                onChange={e => setIsContactFb(!isContactFb)}
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
                  value={contactFb}
                  onChange={handleInputChange}
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
                checked={isContactEmail}
                // TODO: Remove lambda expression
                onChange={e => setIsContactEmail(!isContactEmail)}
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
                  value={contactEmail}
                  onChange={handleInputChange}
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

        {listingType === LISTING_TYPE.SUBSCRIPTION ? (
          <div className="create-listing-edit-footer create-listing-edit-footer-disclaimer">
            WARNING:{" "}
            <Link to="/info" target="_blank" rel="noopener noreferrer">
              Certain subscription providers
            </Link>{" "}
            restrict sharing of their services. It is the user's responsiblity
            to ensure that their subscription listings do not violate their
            provider's terms of use.
          </div>
        ) : null}

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
