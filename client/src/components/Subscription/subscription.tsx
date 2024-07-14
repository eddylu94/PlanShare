// Third-party libraries
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// import moment from "moment";
import LockIcon from "@mui/icons-material/Lock";
import Tooltip from "@mui/material/Tooltip";

// API
import { getSubscription } from "@requests/getRequests";
import {
  archiveSubscription,
  deleteSubscription
} from "@requests/postRequests";

// Utilities
import { UserDataContext } from "user-context-provider";
import { log } from "@utils/utils";
import { OTHER_BRANDS, STATUS_CODE, STATUS_MESSAGE } from "@utils/constants";
import { ClickEvent } from "@utils/interfaces";

const SubscriptionProvider = (props: {
  subscriptionId: string;
  closePane?: () => void;
}) => {
  const _userData = useContext(UserDataContext);

  const { subscriptionId } = props;

  const [subscriptionData, setSubscriptionData] = useState(null as any);

  const [isHoverArchiveButton, setIsHoverArchiveButton] = useState(false);

  const handleMouseOverArchiveButton = () => {
    setIsHoverArchiveButton(true);
  };

  const handleMouseLeaveArchiveButton = () => {
    setIsHoverArchiveButton(false);
  };

  const retrieveSubscriptionResponseHandler = (data: any) => {
    log(data);

    const newSubscriptionData = data?.body?.subscriptionData;
    if (newSubscriptionData) {
      log(newSubscriptionData);
      setSubscriptionData(newSubscriptionData);
    } else if (
      data?.statusCode === STATUS_CODE.FAILURE &&
      data?.statusMessage === STATUS_MESSAGE.USER_NOT_MEMBER_OF_ORGANIZATION
    ) {
      setSubscriptionData({
        organization: data?.organization
      });
    }
  };

  const retrieveSubscription = () => {
    getSubscription(
      subscriptionId,
      !!_userData.user?.auth,
      retrieveSubscriptionResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    if (subscriptionId && subscriptionId !== "guest") {
      retrieveSubscription();
    }
    // eslint-disable-next-line
  }, [subscriptionId]);

  useEffect(() => {
    const description = subscriptionData?.listingDescription;
    if (subscriptionData?.listingDescription != null) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", description);
      document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute("content", description);
      document
        .querySelector('meta[property="twitter:description"]')
        ?.setAttribute("content", description);
    }
  }, [subscriptionData]);

  const userData = _userData;
  const currentUser = _userData.user?.userId as string;

  if (subscriptionData != null && Object.keys(subscriptionData).length === 1) {
    const organization = subscriptionData?.organization;

    return (
      <div className="subscription-guest-login-message">
        <div className="subscription-guest-login-message-wrapper">
          <span>
            The selected listing is only visible for members of the{" "}
            <b>{organization?.name}</b> organization.
            <div className="subscription-external-organization">
              <LockIcon htmlColor="#888" fontSize="large" />
              <img
                className="subscription-external-organization-logo"
                src={organization?.logo}
                alt={organization.name}
              />
            </div>
            Please <Link to="/login">log in</Link> or{" "}
            <Link to="/signup">sign up</Link> to view listing details within an
            organization
          </span>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  const {
    subscriptionBrand,
    listingDescription,
    firstName,
    // createdDate,
    price,
    subscriptionUrl,
    userId,
    otherSubscription,
    organization
  } = subscriptionData;

  const name = OTHER_BRANDS.includes(subscriptionBrand.subscriptionBrandId)
    ? otherSubscription
    : subscriptionBrand.name;

  const isDisplayButtons = !!(userId === (_userData.user?.userId as string));

  const handleArchiveSubscriptionResponseHandler = (data: any) => {
    log(data);
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      props.closePane?.();
      alert(
        "The listing has been archived. Only you are be able to view your archived listings"
      );
    }
  };

  const archiveSubscriptionHandler = (_e: ClickEvent, id: string) => {
    archiveSubscription(
      id,
      handleArchiveSubscriptionResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const handleDeleteSubscriptionResponseHandler = (data: any) => {
    log(data);
    if (data.statusCode === STATUS_CODE.SUCCESS) {
      props.closePane?.();
      alert("The listing has been deleted.");
    }
  };

  const deleteSubscriptionHandler = (_e: ClickEvent, id: string) => {
    deleteSubscription(
      id,
      handleDeleteSubscriptionResponseHandler,
      log,
      _userData.user?.auth
    );
  };

  const isCardReferral = [
    "CHASE_SAPPHIRE_RESERVE_REFERRAL",
    "AMEX_PLATINUM_REFERRAL"
  ].includes(subscriptionBrand.subscriptionBrandId);

  return (
    <div className="subscription-wrapper">
      <div className="subscription-header">
        <img
          alt="Subscription logo"
          className={
            isCardReferral
              ? "subscription-card-referral-card-subscription-logo"
              : "subscription-card-subscription-logo"
          }
          src={subscriptionBrand.logo}
        />
        <div
          className="subscription-card-name subscription-detail-cropped"
          style={{
            fontSize: 18,
            fontWeight: 600
          }}
        >
          {name}
        </div>
      </div>
      <div className="subscription-detail subscription-subscription-detail">
        Posted by{" "}
        <Link to={`profile?id=${userId}`}>
          <span className="subscription-first-name">{firstName}</span>
        </Link>
      </div>
      <div className="subscription-detail subscription-subscription-author-detail">
        <span className="b">{organization ? organization.name : "Public"}</span>
        <img
          alt="Organization logo"
          style={{ opacity: !organization ? 0.5 : 1 }}
          className="subscription-card-organization-logo"
          src={organization ? organization.logo : "/public_icon.png"}
        />
      </div>
      {/* <div className="subscription-detail subscription-subscription-detail">
        <span className="subscription-detail-date">
          {moment(createdDate).format("MMM. D h:mm a")}
        </span>
      </div> */}

      {userId != null && userId !== currentUser && (
        <div className="subscription-detail" style={{ marginTop: 15 }}>
          <Link
            to={!userData.user?.userId ? "signup" : `messages?id=${userId}`}
          >
            <button className="subscription-message-button">
              <span className="b subscription-message-label">{`Message ${firstName}`}</span>
              <img
                alt="Posted date"
                className="subscription-message-icon"
                src="/send_icon_white.png"
              />
            </button>
          </Link>
        </div>
      )}

      <div className="subscription-label">Price</div>
      <div className="subscription-detail subscription-subscription-detail">
        <span className="subscription-detail-bold">${price.toFixed(2)}</span>{" "}
        <span>per person</span>
      </div>
      <div className="subscription-label">Description</div>
      <div className="subscription-detail">
        <div className="subscription-card-description">
          {listingDescription}
        </div>
      </div>

      <div className="subscription-label">Link to subscription</div>
      <div className="subscription-detail">
        {subscriptionUrl ? (
          <a href={subscriptionUrl} target="_blank" rel="noopener noreferrer">
            {subscriptionUrl}
          </a>
        ) : (
          "---"
        )}
      </div>

      {isDisplayButtons && (
        <div className="subscription-pane-buttons">
          <Link to={`edit?id=${subscriptionId}`}>
            <button className="subscription-pane-button">
              <img
                alt="Edit"
                className="subscription-pane-button-icon"
                src="/edit_icon.png"
              />
              Edit
            </button>
          </Link>
          <Tooltip
            title={"Archived listings will only be visible to you"}
            aria-label="Archive listing"
            placement="bottom-start"
            open={isHoverArchiveButton}
          >
            <button
              className="subscription-pane-button"
              onMouseOver={handleMouseOverArchiveButton}
              onMouseLeave={handleMouseLeaveArchiveButton}
              onClick={e => archiveSubscriptionHandler(e, subscriptionId)}
            >
              <img
                alt="Archive"
                className="subscription-pane-button-icon"
                src="/archive_icon.png"
              />
              Archive
            </button>
          </Tooltip>
          <button
            className="subscription-pane-button"
            onClick={e => deleteSubscriptionHandler(e, subscriptionId)}
          >
            <img
              alt="Delete"
              className="subscription-pane-button-icon"
              src="/delete_icon.png"
            />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionProvider;
