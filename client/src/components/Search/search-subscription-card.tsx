import React, { useState } from "react";
import { Link } from "react-router-dom";

import { ISubscriptionData, getDaysAgoString } from "../../utils/utils";

import Tooltip from "@material-ui/core/Tooltip";
import { LISTING_TYPE } from "../../utils/constants";

interface ISearchSubscriptionCardProps {
  subscription: ISubscriptionData;
  isMobile: boolean;
  archiveSubscription?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
  deleteSubscription?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
  isProfile?: boolean;
  handleSubscriptionCardClick?: (subscriptionId: string) => void;
  isDisplayButtons?: boolean;
  isArchived?: boolean;
}

const SearchSubscriptionCard = (props: ISearchSubscriptionCardProps) => {
  const {
    subscription,
    isMobile,
    isProfile,
    handleSubscriptionCardClick,
    isDisplayButtons,
    archiveSubscription,
    deleteSubscription,
    isArchived
  } = props;

  const {
    _id,
    listingType,
    subscriptionBrand,
    listingDescription,
    firstName,
    createdDate,
    price,
    numberOfPeople,
    userId,
    otherSubscription,
    organization
  } = subscription;

  const renderSubscriptionLogo = () => {
    let logo;

    switch (listingType) {
      case LISTING_TYPE.FOR_SALE:
        logo = "./icon.png";
        break;
      case LISTING_TYPE.HOUSING:
        logo = "./icon.png";
        break;
      case LISTING_TYPE.SUBSCRIPTION:
      default:
        logo = subscriptionBrand.logo;
        break;
    }

    return (
      <img
        alt="Subscription logo"
        className="subscription-card-subscription-logo"
        src={logo}
      />
    );
  };

  const renderSubsciptionCardAuthor = () => (
    <div className="subscription-card-author">
      {!isProfile ? (
        <>
          by{" "}
          <div className={"subscription-author-detail"}>
            {userId ? (
              <>
                <Link to={`profile?id=${userId}`} style={{ marginRight: 5 }}>
                  <span className="subscription-card-first-name">
                    {firstName}
                  </span>{" "}
                </Link>
                <>
                  at{" "}
                  <span className="b" style={{ marginLeft: 5 }}>
                    {organization ? organization.name : "Public"}
                  </span>
                  <img
                    alt="Organization logo"
                    className="subscription-card-organization-logo"
                    src={organization ? organization.logo : "/public_icon.png"}
                  />
                </>
              </>
            ) : (
              <>
                <span className="b" style={{ marginRight: 5 }}>
                  {firstName}
                </span>{" "}
                at{" "}
                <span className="b" style={{ marginLeft: 5 }}>
                  {organization ? organization.name : "Public"}
                </span>
                <img
                  alt="Organization logo"
                  className="subscription-card-organization-logo"
                  src={organization ? organization.logo : "/public_icon.png"}
                />
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );

  const renderSubscriptionInfo = () => {
    let name;

    switch (listingType) {
      case LISTING_TYPE.FOR_SALE:
        name = subscription.listingTitle;
        break;
      case LISTING_TYPE.HOUSING:
        name = subscription.listingTitle;
        break;
      case LISTING_TYPE.SUBSCRIPTION:
      default:
        name =
          subscriptionBrand.type === "OTHER"
            ? otherSubscription
            : subscriptionBrand.name;
        break;
    }

    return (
      <div className="subscription-card-info">
        <div className="subscription-card-info-name subscription-detail-cropped">
          {name}
        </div>
        {listingDescription ? (
          <div className="subscription-card-description-container">
            <div className="subscription-card-description">
              <span>{listingDescription}</span>
            </div>
          </div>
        ) : null}
        {!isMobile && !isProfile ? renderSubsciptionCardAuthor() : null}
      </div>
    );
  };

  const renderSubscriptionBasicInfo = () => (
    <div className="subscription-card-basic-info">
      <div className="subscription-card-date">
        {getDaysAgoString(new Date(createdDate))}
      </div>
      <div className="subscription-card-basic-info-detail">
        ${price.toFixed(2)} each
      </div>
      {numberOfPeople ? (
        <div className="subscription-card-basic-info-detail">
          <img
            alt="Number of people"
            className="subscription-card-people-icon"
            src="/people_icon.png"
          />
          {numberOfPeople}
        </div>
      ) : null}
    </div>
  );

  const [isHoverArchiveButton, setIsHoverArchiveButton] = useState(false);

  const handleMouseOverArchiveButton = () => {
    setIsHoverArchiveButton(true);
  };

  const handleMouseLeaveArchiveButton = () => {
    setIsHoverArchiveButton(false);
  };

  return (
    <>
      <div
        className="subscription-card"
        tabIndex={0}
        onClick={() =>
          handleSubscriptionCardClick ? handleSubscriptionCardClick(_id) : {}
        }
      >
        <div
          className="subscription-card-logo-and-info"
          style={{ marginBottom: isProfile ? 10 : 0 }}
        >
          {renderSubscriptionLogo()}
          {renderSubscriptionInfo()}
        </div>
        {isMobile && !isProfile ? renderSubsciptionCardAuthor() : null}
        {renderSubscriptionBasicInfo()}
      </div>
      {isDisplayButtons ? (
        <div className="subscription-card-buttons">
          {!isArchived ? (
            <Link to={`edit?id=${_id}`}>
              <button className="subscription-card-button">
                <img
                  alt="Edit"
                  className="subscription-card-button-icon"
                  src="/edit_icon.png"
                />
                Edit
              </button>
            </Link>
          ) : null}
          {!isArchived ? (
            <Tooltip
              title={"Archived listings will only be visible to you"}
              aria-label="Archive listing"
              placement="bottom-start"
              open={isHoverArchiveButton}
            >
              <button
                className="subscription-card-button"
                onMouseOver={handleMouseOverArchiveButton}
                onMouseLeave={handleMouseLeaveArchiveButton}
                onClick={e =>
                  archiveSubscription ? archiveSubscription(e, _id) : null
                }
              >
                <img
                  alt="Archive"
                  className="subscription-card-button-icon"
                  src="/archive_icon.png"
                />
                Archive
              </button>
            </Tooltip>
          ) : null}
          <button
            className="subscription-card-button"
            onClick={e =>
              deleteSubscription ? deleteSubscription(e, _id) : null
            }
          >
            <img
              alt="Delete"
              className="subscription-card-button-icon"
              src="/delete_icon.png"
            />
            Delete
          </button>
        </div>
      ) : null}
    </>
  );
};

export default SearchSubscriptionCard;
