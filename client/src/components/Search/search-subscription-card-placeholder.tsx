import React from "react";

interface ISearchSubscriptionCardProps {
  isProfile?: boolean;
  isDisplayButtons?: boolean;
}

const SearchSubscriptionCard = (props: ISearchSubscriptionCardProps) => {
  const { isProfile, isDisplayButtons } = props;

  const renderSubscriptionLogo = () => (
    <div className="subscription-card-subscription-logo placeholder-background" />
  );

  const renderSubscriptionInfo = () => {
    return (
      <div className="subscription-card-info">
        <div className="placeholder-text-shape placeholder-background"></div>
        <div className="placeholder-text-shape placeholder-background"></div>
        <div className="placeholder-text-shape placeholder-background"></div>
      </div>
    );
  };

  const renderSubscriptionBasicInfo = () => (
    <div className="subscription-card-basic-info">
      <div className="subscription-card-date"></div>
      <div className="subscription-card-basic-info-detail"></div>
      <div className="subscription-card-basic-info-detail">
        <div className="subscription-card-people-icon" />
      </div>
    </div>
  );

  return (
    <>
      <div className="subscription-card">
        <div
          className="subscription-card-logo-and-info"
          style={{ marginBottom: isProfile ? 10 : 0 }}
        >
          {renderSubscriptionLogo()}
          {renderSubscriptionInfo()}
        </div>
        {renderSubscriptionBasicInfo()}
      </div>
      {isDisplayButtons ? (
        <div className="subscription-card-buttons">
          <div className="subscription-card-button">
            <div className="subscription-card-button-icon" />
          </div>
          <div className="subscription-card-button">
            <div className="subscription-card-button-icon" />
          </div>
          <div className="subscription-card-button">
            <div className="subscription-card-button-icon" />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SearchSubscriptionCard;
