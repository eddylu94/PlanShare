// Third-party libraries
import React, { useState } from "react";
import { Link } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

// Utilities
import {
  mobileAndTabletCheck,
  ISubscriptionData,
  getDaysAgoString
} from "@utils/utils";
import { ClickEvent } from "@utils/interfaces";

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
    potentialLimit,
    sponsor
  } = subscription;

  const [isHoverArchiveButton, setIsHoverArchiveButton] = useState(false);

  const handleMouseOverArchiveButton = () => {
    setIsHoverArchiveButton(true);
  };

  const handleMouseLeaveArchiveButton = () => {
    setIsHoverArchiveButton(false);
  };

  const isCardReferral = [
    "CHASE_SAPPHIRE_RESERVE_REFERRAL",
    "AMEX_PLATINUM_REFERRAL"
  ].includes(subscriptionBrand.subscriptionBrandId);

  const subscriptionLogo = (
    <img
      alt="Subscription logo"
      className={
        isCardReferral
          ? "subscription-card-referral-card-subscription-logo"
          : "subscription-card-subscription-logo"
      }
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
          by{" "}
          <div className={"subscription-author-detail"}>
            {author}
            {sponsor == null && (
              <img
                alt="Organization logo"
                style={{ opacity: !organization ? 0.5 : 1 }}
                className="subscription-card-organization-logo"
                src={organization ? organization.logo : "/public_icon.png"}
              />
            )}
          </div>
        </>
      )}
    </div>
  );

  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = (e: any) => {
    setOpen(!open);
    e.stopPropagation();
  };

  const warningBtn = (
    <IconButton
      onClick={handleTooltipOpen}
      style={{ marginLeft: 5, width: 20, padding: 0 }}
    >
      <WarningIcon
        className="subscription-card-sharing-warning"
        style={{ width: 20 }}
      />
    </IconButton>
  );

  const warningMessage =
    "This listing has been marked by our moderators as a service that may come with sharing limitations. Verify with the service's terms of use before enrolling into any shared services.";
  const warning = mobileAndTabletCheck() ? (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        title={warningMessage}
        PopperProps={{
          disablePortal: true
        }}
        onClose={handleTooltipClose}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        {warningBtn}
      </Tooltip>
    </ClickAwayListener>
  ) : (
    <Tooltip title={warningMessage}>{warningBtn}</Tooltip>
  );

  const isFree = price === 0;
  console.log(isFree);

  const priceInfo = isFree ? (
    <div className="subscription-card-free-tag subscription-card-basic-info-detail">
      Free
    </div>
  ) : (
    <div className="subscription-card-basic-info-detail">
      ${price.toFixed(2)}
    </div>
  );

  const subscriptionBasicInfo = (
    <div className="subscription-card-basic-info">
      {sponsor ? (
        <div className="subscription-card-date">
          <div className="subscription-card-sponsored-tag">Sponsored</div>
        </div>
      ) : (
        <>
          <div className="subscription-card-date i">
            {getDaysAgoString(new Date(createdDate))}
          </div>
          {priceInfo}
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
        {potentialLimit ? warning : null}
      </div>
      {listingDescription && (
        <div className="subscription-card-description-container">
          <div className="subscription-card-description">
            <span>{listingDescription}</span>
          </div>
        </div>
      )}
      {!isProfile ? subsciptionCardAuthor : null}
      {isMobile ? subscriptionBasicInfo : null}
    </div>
  );

  return (
    <>
      <div
        className="subscription-card"
        tabIndex={0}
        onClick={() =>
          sponsor != null
            ? window.open(sponsor.src, "_blank")?.focus()
            : handleSubscriptionCardClick?.(_id)
        }
      >
        <div
          className="subscription-card-logo-and-info"
          style={{ marginBottom: isProfile ? 10 : 0 }}
        >
          {subscriptionLogo}
          {subscriptionInfo}
        </div>
        {!isMobile ? subscriptionBasicInfo : null}
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
