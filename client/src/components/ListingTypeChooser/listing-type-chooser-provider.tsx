import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { baseGetRequest } from "./../../base-requests";
import { STATUS_CODE, LISTING_TYPE } from "../../utils/constants";
import { log, IListingType } from "./../../utils/utils";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import ListingTypeChooserCanvas from "./listing-type-chooser-canvas";

const ListingTypeChooserProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  const [listingTypes, setListingTypes] = useState([] as IListingType[]);

  const handleListingTypeSelection = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: string
  ) => {
    console.log(type);
    switch (type) {
      case LISTING_TYPE.SUBSCRIPTION:
        history.push("/create?type=subscription");
        break;
      case LISTING_TYPE.FOR_SALE:
        history.push("/create?type=forsale");
        break;
      case LISTING_TYPE.HOUSING:
        history.push("/create?type=housing");
        break;
      default:
        break;
    }
  };

  const retrieveListingTypesResponseHandler = (data: any) => {
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      const body = data.body;

      const types = body.listingTypes as IListingType[];
      const typesData = types.map(listingType =>
        Object.assign(listingType, { isSelected: true })
      );
      setListingTypes(typesData);
    }
  };

  const retrieveListingTypesErrorHandler = (error: any) => {
    log(error);
  };

  const retrieveListingTypes = () => {
    baseGetRequest(
      "getlistingtypes",
      [],
      retrieveListingTypesResponseHandler,
      retrieveListingTypesErrorHandler,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveListingTypes();
    // eslint-disable-next-line
  }, []);

  return (
    <ListingTypeChooserCanvas
      listingTypes={listingTypes}
      handleListingTypeSelection={handleListingTypeSelection}
    />
  );
};

const ListingTypeChooserProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <ListingTypeChooserProviderWithContext
        userData={userData}
        history={props.history}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(ListingTypeChooserProvider);
