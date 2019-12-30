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
    return <select onChange={handleChangeSubscriptionType}>{options}</select>;
  };

  const renderSubscriptionGroupDropdown = () => {
    const options = Object.keys(subscriptionGroup).map((key, i) => (
      <option key={"subscription-group-" + i}>{subscriptionGroup[key]}</option>
    ));
    return <select onChange={handleChangeSubscriptionGroup}>{options}</select>;
  };

  return (
    <div className="page-container">
      <form className="create-listing-form">
        <h2>Create Listing</h2>

        <h3>Subscription Information</h3>

        <label>Subscription type:</label>
        {renderSubscriptionTypeDropdown()}

        <label>Subscription:</label>
        {renderSubscriptionGroupDropdown()}

        <label>URL for Subscription Information (optional):</label>
        <input type="text" placeholder="https://tv.youtube.com/" />

        <label>Image URL (optional):</label>
        <input type="text" />

        <h3>Listing Details</h3>

        <label>Listing title:</label>
        <input
          type="text"
          placeholder="Looking for people to start YouTube TV subscription"
        />

        <label>Listing description:</label>
        <textarea
          rows={5}
          placeholder="Currently have two people, need three more!"
        />

        <h3>Requested People</h3>

        <label>Total number of people (including you):</label>
        <input type="number" name="quantity" min="1" max="10" value="2" />

        <label>Number of people already subscribed (including you):</label>
        <input type="number" name="quantity" min="1" max="10" value="5" />

        <label>Estimated price per person:</label>
        <input type="number" min="0.01" step="0.01" max="2500" value="10.00" />
      </form>
    </div>
  );
};

export default CreateListingCanvas;
