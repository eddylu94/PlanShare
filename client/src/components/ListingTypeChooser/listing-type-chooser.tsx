import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import { baseGetRequest } from "../../base-requests";
import { STATUS_CODE, LISTING_TYPE } from "../../utils/constants";
import { log, IListingType } from "../../utils/utils";
import { IUserContext, UserDataContext } from "../../user-context-provider";

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
        history.push("/create?type=for_sale");
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

  const retrieveListingTypes = () => {
    baseGetRequest(
      "getlistingtypes",
      [],
      retrieveListingTypesResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveListingTypes();
    // eslint-disable-next-line
  }, []);

  const cards = listingTypes.map((listingType, i) => (
    <div
      key={"listing-card-" + i}
      className="organizations-organization organizations-organization-card"
      onClick={e => handleListingTypeSelection(e, listingType.type)}
    >
      <img alt="Amazon" src={listingType.icon} className="listing-type-icon" />
      <div className="listing-type-label">{listingType.name}</div>
    </div>
  ));

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <form className="form-container" onSubmit={() => {}} noValidate>
        <h2 className="form-header">{"Choose listing type"}</h2>
        {cards}
      </form>
    </div>
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
