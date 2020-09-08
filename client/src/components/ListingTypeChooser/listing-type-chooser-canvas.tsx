import React from "react";

import { IListingType } from "./../../utils/utils";

interface IListingTypeChooserProps {
  listingTypes: IListingType[];
  handleListingTypeSelection: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: string
  ) => void;
}

const ListingTypeChooserCanvas = (props: IListingTypeChooserProps) => {
  const { listingTypes, handleListingTypeSelection } = props;

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

export default ListingTypeChooserCanvas;
