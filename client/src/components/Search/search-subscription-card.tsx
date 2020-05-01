import React, { useState } from "react";
import { Link } from "react-router-dom";

import { ISubscriptionData, getDaysAgoString } from "../../utils/utils";

import Tooltip from "@material-ui/core/Tooltip";

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
    subscriptionBrand,
    listingDescription,
    firstName,
    createdDate,
    price,
    numberOfPeople,
    userId,
    otherSubscription
  } = subscription;

  const renderSubscriptionLogo = () => (
    <img
      alt="Subscription logo"
      className="subscription-card-subscription-logo"
      src={subscriptionBrand.logo}
    />
  );

  const renderSubsciptionCardAuthor = () => (
    <div className="subscription-card-author">
      <div>
        {!isProfile ? (
          <>
            Posted by{" "}
            <Link to={`profile?id=${userId}`}>
              <span className="subscription-card-first-name">{firstName}</span>{" "}
            </Link>
          </>
        ) : null}
        {/* at {organization.name} */}
      </div>
      {/* <img
        alt="Organization logo"
        className="subscription-card-organization-logo"
        src={organization.logo}
      /> */}
    </div>
  );

  const renderSubscriptionInfo = () => {
    const name =
      subscriptionBrand.type === "OTHER"
        ? otherSubscription
        : subscriptionBrand.name;

    return (
      <div className="subscription-card-info">
        <div className="subscription-card-info-name">{name}</div>
        <div className="subscription-card-description-container">
          <div className="subscription-card-description">
            <span>{listingDescription}</span>
          </div>
        </div>
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
        ${price.toFixed(2)}
      </div>
      <div className="subscription-card-basic-info-detail">
        <img
          alt="Number of people"
          className="subscription-card-people-icon"
          src="/people_icon.png"
        />
        {numberOfPeople}
      </div>
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
