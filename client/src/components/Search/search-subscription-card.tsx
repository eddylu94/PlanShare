// Third-party libraries
import React, { useState } from "react";
import { Link } from "react-router-dom";
import WarningIcon from "@mui/icons-material/WarningAmber";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// Utilities
import { ISubscriptionData, getDaysAgoString } from "../../utils/utils";
import { ClickEvent } from "../../utils/interfaces";

interface ISearchSubscriptionCardProps {
  subscription: ISubscriptionData;
  isMobile: boolean;
  isProfile?: boolean;
  isDisplayButtons?: boolean;
  isArchived?: boolean;
  archiveSubscription?: (event: ClickEvent, id: string) => void;
  deleteSubscription?: (event: ClickEvent, id: string) => void;
  handleSubscriptionCardClick?: (subscriptionId: string) => void;
}

const SearchSubscriptionCard = (props: ISearchSubscriptionCardProps) => {
  const {
    subscription,
    isMobile,
    isProfile,
    isDisplayButtons,
    isArchived,
    handleSubscriptionCardClick,
    archiveSubscription,
    deleteSubscription
  } = props;

  const {
    _id,
    subscriptionBrand,
    listingDescription,
    firstName,
    createdDate,
    price,
    userId,
    otherSubscription,
    organization,
    potentialLimit
  } = subscription;

  const [isHoverArchiveButton, setIsHoverArchiveButton] = useState(false);

  const handleMouseOverArchiveButton = () => {
    setIsHoverArchiveButton(true);
  };

  const handleMouseLeaveArchiveButton = () => {
    setIsHoverArchiveButton(false);
  };

  const subscriptionLogo = (
    <img
      alt="Subscription logo"
      className="subscription-card-subscription-logo"
      src={subscriptionBrand.logo}
    />
  );

  const name = <span className="b">{firstName}</span>;
  const author = userId ? (
    <Link to={`profile?id=${userId}`}>{name}</Link>
  ) : (
    name
  );

  const subsciptionCardAuthor = (
    <div className="subscription-card-author">
      {!isProfile && (
        <>
          Posted by{" "}
          <div className={"subscription-author-detail"}>
            {author}
            <img
              alt="Organization logo"
              style={{ opacity: !organization ? 0.5 : 1 }}
              className="subscription-card-organization-logo"
              src={organization ? organization.logo : "/public_icon.png"}
            />
          </div>
        </>
      )}
    </div>
  );

  const subscriptionInfo = (
    <div className="subscription-card-info">
      <div className="subscription-card-header">
        <div className="subscription-card-info-name subscription-detail-cropped">
          {subscriptionBrand.type === "OTHER"
            ? otherSubscription
            : subscriptionBrand.name}
        </div>
        {potentialLimit && (
          <Tooltip title="This listing has been marked by our moderators or community as a service that may come with limitations regarding sharing. Verify with the service's terms of use before enrolling into any shared services.">
            <IconButton style={{ marginLeft: 5, width: 20, padding: 0 }}>
              <WarningIcon
                className="subscription-card-sharing-warning"
                style={{ width: 20 }}
              />
            </IconButton>
          </Tooltip>
        )}
      </div>
      {listingDescription && (
        <div className="subscription-card-description-container">
          <div className="subscription-card-description">
            <span>{listingDescription}</span>
          </div>
        </div>
      )}
      {!isMobile && !isProfile && subsciptionCardAuthor}
    </div>
  );

  const subscriptionBasicInfo = (
    <div className="subscription-card-basic-info">
      <div className="subscription-card-date i">
        {getDaysAgoString(new Date(createdDate))}
      </div>
      <div className="subscription-card-basic-info-detail">
        ${price.toFixed(2)}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="subscription-card"
        tabIndex={0}
        onClick={() => handleSubscriptionCardClick?.(_id)}
      >
        <div
          className="subscription-card-logo-and-info"
          style={{ marginBottom: isProfile ? 10 : 0 }}
        >
          {subscriptionLogo}
          {subscriptionInfo}
        </div>
        {isMobile && !isProfile && subsciptionCardAuthor}
        {subscriptionBasicInfo}
      </div>
      {isDisplayButtons && (
        <div className="subscription-card-buttons">
          {!isArchived && (
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
          )}
          {!isArchived && (
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
                onClick={e => archiveSubscription?.(e, _id)}
              >
                <img
                  alt="Archive"
                  className="subscription-card-button-icon"
                  src="/archive_icon.png"
                />
                Archive
              </button>
            </Tooltip>
          )}
          <button
            className="subscription-card-button"
            onClick={e => deleteSubscription?.(e, _id)}
          >
            <img
              alt="Delete"
              className="subscription-card-button-icon"
              src="/delete_icon.png"
            />
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default SearchSubscriptionCard;
