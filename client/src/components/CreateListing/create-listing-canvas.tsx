import React from "react";

interface ICreateListingCanvasProps {
  subscriptionTypes: { [key: string]: string };
  subscriptionGroup: { [key: string]: string };
  handleChangeSubscriptionType: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  handleChangeSubscriptionGroup: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

const CreateListingCanvas = (props: ICreateListingCanvasProps) => {
  const {
    subscriptionTypes,
    subscriptionGroup,
    handleChangeSubscriptionType,
    handleChangeSubscriptionGroup
  } = props;

  const renderSubscriptionTypeDropdown = () => {
    const options = Object.keys(subscriptionTypes).map((key, i) => (
      <option key={"subscription-type-" + i}>{subscriptionTypes[key]}</option>
    ));
    return (
      <select
        className="form-text-input"
        onChange={handleChangeSubscriptionType}
      >
        {options}
      </select>
    );
  };

  const renderSubscriptionGroupDropdown = () => {
    const options = Object.keys(subscriptionGroup).map((key, i) => (
      <option key={"subscription-group-" + i}>{subscriptionGroup[key]}</option>
    ));
    return (
      <select
        className="form-text-input"
        onChange={handleChangeSubscriptionGroup}
      >
        {options}
      </select>
    );
  };

  return (
    <div className="page-container" style={{ alignItems: "center" }}>
      <form className="form-container" style={{ width: "45%" }}>
        <h2 className="form-header">Create Listing</h2>

        <h3 className="form-subheader">Subscription Information</h3>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Subscription type:</label>
            {renderSubscriptionTypeDropdown()}
          </div>

          <div className="form-field" style={{ marginLeft: 80 }}>
            <label className="form-label">Subscription:</label>
            {renderSubscriptionGroupDropdown()}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">
            URL for subscription information (optional):
          </label>
          <input
            className="form-text-input"
            type="text"
            placeholder="https://tv.youtube.com/"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Image URL (optional):</label>
          <input className="form-text-input" type="text" />
        </div>

        <h3 className="form-subheader">Listing Details</h3>

        <div className="form-field">
          <label className="form-label">Listing title:</label>
          <input
            className="form-text-input"
            type="text"
            placeholder="Looking for people to start YouTube TV subscription"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Listing description:</label>
          <textarea
            className="form-text-area"
            rows={5}
            placeholder="Currently have two people, need three more!"
          />
        </div>

        <h3 className="form-subheader">Membership Information</h3>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Looking for:</label>
            <div className="form-number-input-with-label">
              <input
                className="form-text-input form-number-input"
                type="number"
                name="quantity"
                min="1"
                max="10"
                placeholder="2"
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
              type="number"
              min="0.01"
              step="0.01"
              max="2500"
              placeholder="10.00"
              style={{ width: 100 }}
            />
            <span style={{ marginLeft: 10 }}>$</span>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">
            Which group you are posting to (Choose only one):
          </label>
          <select className="form-text-input">
            <option>McGill University</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default CreateListingCanvas;
