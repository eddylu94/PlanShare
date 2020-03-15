import React from "react";

import { FORM_INPUT_TYPE } from "./create-listing-utils";

interface IOrganization {
  domain: string;
  name: string;
}

interface ISubscriptionBrand {
  type: string;
  name: string;
  logo: string;
}

interface ICreateListingCanvasProps {
  subscriptionCategories: string[];
  subscriptionBrands: ISubscriptionBrand[];
  organizations: IOrganization[];

  handleInputChange: (event: React.ChangeEvent<any>) => void;

  subscriptionUrl: string;

  listingTitle: string;
  listingDescription: string;
  numberOfPeople: number;
  price: number;

  isFormDisabled: boolean;

  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CreateListingCanvas = (props: ICreateListingCanvasProps) => {
  const {
    subscriptionCategories,
    subscriptionBrands,
    organizations,
    handleInputChange,
    subscriptionUrl,
    listingTitle,
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
      <option key={"subscription-type-" + i}>{category}</option>
    ));
    return (
      <select
        className="form-text-input"
        name={FORM_INPUT_TYPE.SUBSCRIPTION_TYPE}
        onChange={handleInputChange}
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
      <option key={"subscription-organization-" + i}>
        {subscriptionBrand.name}
      </option>
    ));
    return (
      <select
        className="form-text-input"
        name={FORM_INPUT_TYPE.SUBSCRIPTION_BRAND}
        onChange={handleInputChange}
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
        style={{ width: "45%" }}
      >
        <h2 className="form-header">Create Listing</h2>

        <h3 className="form-subheader">Subscription Information</h3>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Subscription type:</label>
            {renderSubscriptionCategoryDropdown()}
          </div>

          <div className="form-field" style={{ marginLeft: 80 }}>
            <label className="form-label">Subscription:</label>
            {renderSubscriptionBrandDropdown()}
          </div>
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

        <div className="form-field">
          <label className="form-label">Listing title:</label>
          <input
            className="form-text-input"
            name={FORM_INPUT_TYPE.LISTING_TITLE}
            type="text"
            placeholder="Looking for people to start YouTube TV subscription"
            value={listingTitle}
            onChange={handleInputChange}
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

        <div className="form-field">
          <label className="form-label">
            Which organization you are posting to (Choose only one):
          </label>
          <select className="form-text-input" style={{ width: 500 }}>
            {organizations.map((organization, i) => {
              return (
                <option
                  value={organization.domain}
                  key={"organization-" + i}
                >{`${organization.name} (${organization.domain})`}</option>
              );
            })}
          </select>
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
