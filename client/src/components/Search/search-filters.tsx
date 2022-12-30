import React from "react";

import { SORT_BY } from "./search-utils";
import { ISearchFiltersProps } from "./search-utils";
import { DEVICE_MODE } from "./../../utils/constants";

import Scrollbars from "react-custom-scrollbars";

import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import { useDeviceMode } from "../../utils/utils";

const SearchFilters = (props: ISearchFiltersProps) => {
  const {
    isDrawer,
    listingTypes,
    isSubscriptionsType,
    // isForSaleType,
    filtersSubscriptionCategories,
    filtersGroupSize,
    filtersPrice,
    filtersSortBy,
    // filtersDaysActive,
    toggleListingType,
    toggleFiltersSubscriptionCategory,
    handleGroupSizeChange,
    handlePriceChange,
    handleSortByChange
    // handleDaysActiveChange
  } = props;

  const deviceMode = useDeviceMode();

  const listingTypeCheckboxes = listingTypes.map((listingType, index) => {
    return (
      <FormControlLabel
        key={"filters-category-" + index}
        style={{ color: "#000000" }}
        control={
          <Checkbox
            checked={listingType.isSelected}
            // TODO: Remove lambda expression
            onChange={e => toggleListingType(e, listingType.type)}
            name={listingType.name}
            style={{
              padding: 0,
              margin: "5px 5px 5px 20px",
              color: "#6C5DBD"
            }}
          />
        }
        label={
          <div className="flex-horizontal-centered">
            <img
              alt="Subscriptions"
              className="search-filters-listing-type-icon"
              src={listingType.icon}
            />
            <Typography style={{ fontSize: 15 }}>{listingType.name}</Typography>
          </div>
        }
      />
    );
  });

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
          label={
            <Typography style={{ fontSize: 15 }}>{category.name}</Typography>
          }
        />
      );
    }
  );

  function valuetext(value: number) {
    return `${value}°C`;
  }

  const FiltersFormLabel = (props: { label: string }) => (
    <FormLabel
      component="legend"
      style={{ marginBottom: 12, fontSize: 16, color: "#6C5DBD" }}
    >
      {props.label}
    </FormLabel>
  );

  const filtersRadioStyles = {
    padding: 0,
    margin: "5px 5px 5px 20px",
    color: "#6C5DBD"
  };

  const createMarks = (values: number[], isCurrency?: boolean) =>
    values.map(value => {
      return {
        value,
        label: isCurrency ? "$" + value.toString() : value.toString()
      };
    });

  const sliderStyles = {
    marginLeft: 12,
    width: 180,
    color: "#6C5DBD"
  };

  const filterPaneClassName = isDrawer
    ? "filter-pane"
    : "filter-pane search-pane";

  const scrollBarsStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    margin: "20px 10px 20px 20px",
    borderRadius: 10,
    height: "calc(100% - 40px)",
    backgroundColor: "#FFFFFF"
  };

  if (deviceMode === DEVICE_MODE.MOBILE) {
    Object.assign(scrollBarsStyle, {
      width: "calc(100% - 20px)"
    });
  } else {
    Object.assign(scrollBarsStyle, {
      width: 250,
      minWidth: 250,
      maxWidth: 250,
      boxShadow: "0px 0px 10px #d8d8d8"
    });
  }

  return (
    <Scrollbars autoHide style={scrollBarsStyle}>
      <div className={filterPaneClassName} style={{ boxShadow: "none" }}>
        <FormControl component="fieldset" style={{ flexShrink: 0 }}>
          <FiltersFormLabel label={"Listing Type"} />
          <FormGroup>{listingTypeCheckboxes}</FormGroup>
        </FormControl>

        {isSubscriptionsType ? (
          <>
            <FormControl
              component="fieldset"
              style={{ flexShrink: 0, marginTop: 20 }}
            >
              <FiltersFormLabel label={"Subscription Category"} />
              <FormGroup>{subscriptionCategoryCheckboxes}</FormGroup>
            </FormControl>

            <FormControl
              component="fieldset"
              style={{ flexShrink: 0, marginTop: 20 }}
            >
              <FiltersFormLabel label={"Subscription Price"} />
              <Slider
                style={sliderStyles}
                getAriaValueText={valuetext}
                aria-labelledby="range-slider"
                step={1}
                valueLabelDisplay="auto"
                value={filtersPrice}
                onChange={handlePriceChange}
                marks={createMarks([0, 100], true)}
                min={0}
                max={100}
              />
            </FormControl>

            <FormControl
              component="fieldset"
              style={{ flexShrink: 0, marginTop: 20 }}
            >
              <FiltersFormLabel label={"Subscription Group Size"} />
              <Slider
                style={sliderStyles}
                getAriaValueText={valuetext}
                aria-labelledby="range-slider"
                step={1}
                valueLabelDisplay="auto"
                value={filtersGroupSize}
                onChange={handleGroupSizeChange}
                marks={createMarks([1, 50])}
                min={1}
                max={50}
              />
            </FormControl>
          </>
        ) : null}

        {/* <FormControl
          component="fieldset"
          style={{ flexShrink: 0, marginTop: 20 }}
        >
          <FiltersFormLabel label={"Days Active"} />
          <Slider
            style={sliderStyles}
            value={filtersDaysActive}
            onChange={handleDaysActiveChange}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-custom"
            step={1}
            valueLabelDisplay="auto"
            marks={createMarks([0, 180])}
            min={0}
            max={180}
          />
        </FormControl> */}

        <FormControl
          component="fieldset"
          style={{ flexShrink: 0, marginTop: 20 }}
        >
          <FiltersFormLabel label={"Sort Results"} />
          <RadioGroup
            aria-label="Sort results by"
            name="sort-by"
            value={filtersSortBy}
            onChange={handleSortByChange}
          >
            <FormControlLabel
              value={SORT_BY.DATE_DES}
              control={<Radio style={filtersRadioStyles} />}
              label={
                <Typography style={{ fontSize: 15 }}>
                  {"Date (newest at top)"}
                </Typography>
              }
            />
            <FormControlLabel
              value={SORT_BY.DATE_ASC}
              control={<Radio style={filtersRadioStyles} />}
              label={
                <Typography style={{ fontSize: 15 }}>
                  {"Date (oldest at top)"}
                </Typography>
              }
            />
            {/* <FormControlLabel
              value={SORT_BY.SUBSCRIPTION_BRAND_ASC}
              control={<Radio style={filtersRadioStyles} />}
              label={
                <Typography style={{ fontSize: 15 }}>
                  {"Title (A to Z)"}
                </Typography>
              }
            />
            <FormControlLabel
              value={SORT_BY.SUBSCRIPTION_BRAND_DES}
              control={<Radio style={filtersRadioStyles} />}
              label={
                <Typography style={{ fontSize: 15 }}>
                  {"Title (Z to A)"}
                </Typography>
              }
            /> */}
          </RadioGroup>
        </FormControl>
      </div>
    </Scrollbars>
  );
};

export default SearchFilters;
