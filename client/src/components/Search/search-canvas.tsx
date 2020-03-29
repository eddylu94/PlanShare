import React from "react";
import {
  IOrganization,
  IFiltersOrganization,
  IFiltersSubscriptionCategory
} from "../../utils/utils";
import { SORT_BY } from "./search-utils";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Slider from "@material-ui/core/Slider";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

interface ISubscription {
  name: string;
  type: string;
  logo: string;
}

export interface ISubscriptionData {
  _id: string;
  subscriptionTypeSelection: string;
  subscriptionBrand: ISubscription;
  subscriptionUrl: string;
  listingDescription: string;
  numberOfPeople: number;
  price: number;
  userId: string;
  firstName: string;
  organization: IOrganization;
  createdDate: string;
}

interface ISearchCanvasProps {
  subscriptionData: ISubscriptionData[];
  filtersOrganizations: IFiltersOrganization[];
  filtersSubscriptionCategories: IFiltersSubscriptionCategory[];
  filtersGroupSize: number[];
  filtersSortBy: string;
  filtersDaysActive: number;
  toggleFiltersOrganization: (
    event: React.ChangeEvent<HTMLInputElement>,
    organizationId: string
  ) => void;
  toggleFiltersSubscriptionCategory: (
    event: React.ChangeEvent<HTMLInputElement>,
    subscriptionCategoryId: string
  ) => void;
  handleGroupSizeChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
  handleSortByChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDaysActiveChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
}

const SubscriptionCard = (props: { subscription: ISubscriptionData }) => {
  const { subscription } = props;

  const {
    subscriptionBrand,
    listingDescription,
    firstName,
    organization,
    createdDate
  } = subscription;

  const getDaysAgoString = (d: Date) => {
    const differenceInMilliseconds = new Date().getTime() - d.getTime();

    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / 1000 / 60
    );

    if (differenceInMinutes === 0) {
      return "Just posted";
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min ago`;
    } else {
      const differenceInHours = Math.floor(differenceInMinutes / 60);

      if (differenceInHours === 1) {
        return "1 hour ago";
      } else if (differenceInHours < 24) {
        return `${differenceInHours} hours ago`;
      } else {
        const differenceInDays = Math.floor(differenceInHours / 24);

        if (differenceInDays === 1) {
          return "1 day ago";
        } else {
          return `${differenceInDays} days ago`;
        }
      }
    }
  };

  return (
    <div className="subscription-card" tabIndex={0}>
      <img
        alt="Subscription logo"
        className="subscription-card-subscription-logo"
        src={subscriptionBrand.logo}
      />
      <div className="subscription-card-info">
        <div className="subscription-card-info-name">
          {subscriptionBrand.name}
        </div>
        <div className="subscription-card-description">
          {listingDescription}
        </div>
        <div className="subscription-card-author">
          <div>
            Posted by{" "}
            <span className="subscription-card-first-name">{firstName}</span> at{" "}
            {organization.name}
          </div>
          <img
            alt="Organization logo"
            className="subscription-card-organization-logo"
            src={organization.logo}
          />
        </div>
      </div>
      <div className="subscription-card-date-and-people">
        <div className="subscription-card-date">
          {getDaysAgoString(new Date(createdDate))}
        </div>
        <div className="subscription-card-people">
          <img
            alt="Number of people"
            className="subscription-card-people-icon"
            src="/people_icon.png"
          />
          {subscription.numberOfPeople}
        </div>
      </div>
    </div>
  );
};

const SearchCanvas = (props: ISearchCanvasProps) => {
  const {
    subscriptionData,
    filtersOrganizations,
    filtersSubscriptionCategories,
    filtersGroupSize,
    filtersSortBy,
    filtersDaysActive,
    toggleFiltersOrganization,
    toggleFiltersSubscriptionCategory,
    handleGroupSizeChange,
    handleSortByChange,
    handleDaysActiveChange
  } = props;

  const subscriptionCards = subscriptionData.map((subscription, i) => {
    return (
      <SubscriptionCard
        key={"subscription-card-" + i}
        subscription={subscription}
      />
    );
  });

  const organizationCheckboxes = filtersOrganizations.map(
    (organization, index) => {
      return (
        <FormControlLabel
          key={"filters-organization-" + index}
          style={{ color: "#000000" }}
          control={
            <Checkbox
              checked={organization.isSelected}
              // TODO: Remove lambda expression
              onChange={e =>
                toggleFiltersOrganization(e, organization.organizationId)
              }
              name={organization.name}
              style={{
                padding: 0,
                margin: "5px 5px 5px 20px",
                color: "#6C5DBD"
              }}
            />
          }
          label={organization.name}
        />
      );
    }
  );

  const subscriptionCategoryCheckboxes = filtersSubscriptionCategories.map(
    (category, index) => {
      return (
        <FormControlLabel
          key={"filters-category-" + index}
          style={{ color: "#000000" }}
          control={
            <Checkbox
              checked={category.isSelected}
              // TODO: Remove lambda expression
              onChange={e =>
                toggleFiltersSubscriptionCategory(
                  e,
                  category.subscriptionCategoryId
                )
              }
              name={category.name}
              style={{
                padding: 0,
                margin: "5px 5px 5px 20px",
                color: "#6C5DBD"
              }}
            />
          }
          label={category.name}
        />
      );
    }
  );

  function valuetext(value: number) {
    return `${value}°C`;
  }

  return (
    <div className="search-panes">
      <div className="filter-pane">
        <FormControl component="fieldset">
          <FormLabel
            component="legend"
            style={{ marginBottom: 12, color: "#6C5DBD" }}
          >
            Organization
          </FormLabel>
          <FormGroup>{organizationCheckboxes}</FormGroup>
        </FormControl>

        <FormControl component="fieldset" style={{ marginTop: 20 }}>
          <FormLabel
            component="legend"
            style={{ marginBottom: 12, color: "#6C5DBD" }}
          >
            Subscription Category
          </FormLabel>
          <FormGroup>{subscriptionCategoryCheckboxes}</FormGroup>
        </FormControl>

        <FormControl component="fieldset" style={{ marginTop: 20 }}>
          <FormLabel
            component="legend"
            style={{ marginBottom: 12, color: "#6C5DBD" }}
          >
            Group Size
          </FormLabel>
          <Slider
            style={{ marginLeft: 12, width: 180, color: "#6C5DBD" }}
            getAriaValueText={valuetext}
            aria-labelledby="range-slider"
            step={1}
            valueLabelDisplay="auto"
            value={filtersGroupSize}
            onChange={handleGroupSizeChange}
            marks={[
              {
                value: 2,
                label: "2"
              },
              {
                value: 10,
                label: "10"
              }
            ]}
            min={2}
            max={10}
          />
        </FormControl>

        <FormControl component="fieldset" style={{ marginTop: 20 }}>
          <FormLabel
            component="legend"
            style={{ marginBottom: 12, color: "#6C5DBD" }}
          >
            Days Active
          </FormLabel>
          <Slider
            style={{ marginLeft: 12, width: 180, color: "#6C5DBD" }}
            value={filtersDaysActive}
            onChange={handleDaysActiveChange}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-custom"
            step={1}
            valueLabelDisplay="auto"
            marks={[
              {
                value: 0,
                label: "0"
              },
              {
                value: 30,
                label: "30"
              }
            ]}
            min={0}
            max={30}
          />
        </FormControl>

        <FormControl component="fieldset" style={{ marginTop: 20 }}>
          <FormLabel
            component="legend"
            style={{ marginBottom: 12, color: "#6C5DBD" }}
          >
            Sort Results by
          </FormLabel>
          <RadioGroup
            aria-label="Sort results by"
            name="sort-by"
            value={filtersSortBy}
            onChange={handleSortByChange}
          >
            <FormControlLabel
              value={SORT_BY.DATE_DES}
              control={
                <Radio
                  style={{
                    padding: 0,
                    margin: "5px 5px 5px 20px",
                    color: "#6C5DBD"
                  }}
                />
              }
              label="Date (newest at top)"
            />
            <FormControlLabel
              value={SORT_BY.DATE_ASC}
              control={
                <Radio
                  style={{
                    padding: 0,
                    margin: "5px 5px 5px 20px",
                    color: "#6C5DBD"
                  }}
                />
              }
              label="Date (oldest at top)"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="results-pane">
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              className="search-text-input"
              placeholder="Search for a subscription"
              autoFocus
            />
            <button className="search-submit-button">
              <img
                alt="Search"
                className="search-icon"
                src="/search_icon.png"
              />
            </button>
          </div>
        </div>
        <div className="search-subscription-cards-container">
          {subscriptionCards}
        </div>
      </div>
    </div>
  );
};

export default SearchCanvas;
