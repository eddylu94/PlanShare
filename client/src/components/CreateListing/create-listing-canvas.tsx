import React from "react";

import { FORM_INPUT_TYPE } from "./create-listing-utils";
import { ISubscriptionCategory, ISubscriptionBrand } from "./../../utils/utils";

interface IOrganization {
  domains: string[];
  name: string;
  logo: string;
}

interface ICreateListingCanvasProps {
  subscriptionCategories: ISubscriptionCategory[];
  subscriptionCategorySelection: ISubscriptionCategory;
  subscriptionBrands: ISubscriptionBrand[];
  subscriptionBrandLogo: string;
  subscriptionBrandSelection: ISubscriptionBrand;
  organizations: IOrganization[];
  organizationSelection: IOrganization;

  handleInputChange: (event: React.ChangeEvent<any>) => void;

  subscriptionUrl: string;

  listingDescription: string;
  numberOfPeople: number;
  price: number;

  isFormDisabled: boolean;

  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CreateListingCanvas = (props: ICreateListingCanvasProps) => {
  const {
    subscriptionCategories,
    subscriptionCategorySelection,
    subscriptionBrands,
    subscriptionBrandLogo,
    subscriptionBrandSelection,
    organizations,
    organizationSelection,
    handleInputChange,
    subscriptionUrl,
    listingDescription,
    numberOfPeople,
    price,
    isFormDisabled,
    handleSubmit
  } = props;

  const renderSubscriptionCategoryDropdown = () => {
    if (
      !(subscriptionCategories && Object.keys(subscriptionCategories).length)
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
        className="form-text-input"
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
        className="form-text-input"
        name={FORM_INPUT_TYPE.SUBSCRIPTION_BRAND}
        onChange={handleInputChange}
        value={subscriptionBrandSelection.subscriptionBrandId}
      >
        {options}
      </select>
    );
  };

  return (
    <div className="page-container" style={{ alignItems: "center" }}>
      <form
        className="form-container"
        onSubmit={handleSubmit}
        style={{ width: "45%", minWidth: 800 }}
      >
        <h2 className="form-header">Create Listing</h2>

        <h3 className="form-subheader">Subscription Information</h3>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Subscription type:</label>
            {renderSubscriptionCategoryDropdown()}
          </div>

          <div className="form-field" style={{ marginLeft: 50 }}>
            <label className="form-label">Subscription:</label>
            {renderSubscriptionBrandDropdown()}
          </div>

          <img
            alt="Subscription logo"
            className="create-listing-subscription-logo"
            src={subscriptionBrandLogo}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Listing description:</label>
          <textarea
            className="form-text-area"
            name={FORM_INPUT_TYPE.LISTING_DESCRIPTION}
            rows={5}
            placeholder="Currently have two people, need three more!"
            value={listingDescription}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label className="form-label">
            URL for subscription information (optional):
          </label>
          <input
            className="form-text-input"
            name={FORM_INPUT_TYPE.SUBSCRIPTION_URL}
            type="text"
            placeholder="https://tv.youtube.com/"
            value={subscriptionUrl}
            onChange={handleInputChange}
          />
        </div>

        <h3 className="form-subheader">Membership Information</h3>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Looking for:</label>
            <div className="form-number-input-with-label">
              <input
                className="form-text-input form-number-input"
                name={FORM_INPUT_TYPE.NUMBER_OF_PEOPLE}
                type="number"
                min="1"
                max="10"
                placeholder="2"
                value={numberOfPeople}
                onChange={handleInputChange}
              />
              <span style={{ marginLeft: 10 }}>people</span>
            </div>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Estimated price per person:</label>
          <div className="form-number-input-with-label">
            <input
              className="form-text-input form-number-input"
              name={FORM_INPUT_TYPE.PRICE}
              type="number"
              min="0.01"
              step="0.01"
              max="2500"
              placeholder="10.00"
              value={price}
              onChange={handleInputChange}
              style={{ width: 100 }}
            />
            <span style={{ marginLeft: 10 }}>$</span>
          </div>
        </div>

        <div className="create-listing-organization-field">
          <div className="form-field">
            <label className="form-label">
              Which organization you are posting to (Choose only one):
            </label>

            <select className="form-text-input" style={{ maxWidth: 500 }}>
              {organizations.map((organization, i) => {
                return (
                  <option
                    value={organization.domains[0]}
                    key={"organization-" + i}
                  >{`${organization.name} (${organization.domains[0]})`}</option>
                );
              })}
            </select>
          </div>
          <img
            alt="Organization logo"
            className="create-listing-organization-logo"
            src={organizationSelection.logo}
          />
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
