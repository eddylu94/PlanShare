import React, { useState } from "react";

import CreateListingCanvas from "./create-listing-canvas";
import {
  SUBSCRIPTION_TYPE,
  getSubscriptionGroup,
  LIVE_TV_STREAMING
} from "./../../subscriptions";

const CreateListingProvider = () => {
  const [subscriptionGroup, setSubscriptionGroup] = useState(LIVE_TV_STREAMING);
  // const [subscription, setSubscription] = useState(LIVE_TV_STREAMING.YOUTUBE);

  const handleChangeSubscriptionType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSubscriptionGroup = getSubscriptionGroup(event.target.value);
    setSubscriptionGroup(newSubscriptionGroup);
  };

  const handleChangeSubscriptionGroup = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // const newSubscription = event.target.value;
    // setSubscription(newSubscription);
  };

  return (
    <CreateListingCanvas
      subscriptionTypes={SUBSCRIPTION_TYPE}
      subscriptionGroup={subscriptionGroup}
      handleChangeSubscriptionType={handleChangeSubscriptionType}
      handleChangeSubscriptionGroup={handleChangeSubscriptionGroup}
    />
  );
};

export default CreateListingProvider;
