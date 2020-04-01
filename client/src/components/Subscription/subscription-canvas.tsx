import React from "react";

import { ISubscriptionData } from "./../../utils/utils";

interface ISubscriptionCanvasProps {
  subscriptionData: ISubscriptionData;
}

const SubscriptionCanvas = (props: ISubscriptionCanvasProps) => {
  const { subscriptionData } = props;

  if (!subscriptionData) {
    return null;
  }

  return <div>{subscriptionData.subscriptionBrand.name}</div>;
};

export default SubscriptionCanvas;
