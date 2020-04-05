import React from "react";

import { SORT_BY } from "./search-utils";
import { ISearchFiltersProps } from "./search-utils";

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

const SearchFilters = (props: ISearchFiltersProps) => {
  const {
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
          label={
            <Typography style={{ fontSize: 15 }}>
              {organization.name}
            </Typography>
          }
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

  const createMarks = (values: number[]) =>
    values.map(value => {
      return { value, label: value.toString() };
    });

  const sliderStyles = {
    marginLeft: 12,
    width: 180,
    color: "#6C5DBD"
  };

  return (
    <div className="filter-pane search-pane">
      <FormControl component="fieldset">
        <FiltersFormLabel label={"Organization"} />
        <FormGroup>{organizationCheckboxes}</FormGroup>
      </FormControl>

      <FormControl component="fieldset" style={{ marginTop: 20 }}>
        <FiltersFormLabel label={"Subscription Category"} />
        <FormGroup>{subscriptionCategoryCheckboxes}</FormGroup>
      </FormControl>

      <FormControl component="fieldset" style={{ marginTop: 20 }}>
        <FiltersFormLabel label={"Group Size"} />
        <Slider
          style={sliderStyles}
          getAriaValueText={valuetext}
          aria-labelledby="range-slider"
          step={1}
          valueLabelDisplay="auto"
          value={filtersGroupSize}
          onChange={handleGroupSizeChange}
          marks={createMarks([2, 10])}
          min={2}
          max={10}
        />
      </FormControl>

      <FormControl component="fieldset" style={{ marginTop: 20 }}>
        <FiltersFormLabel label={"Days Active"} />
        <Slider
          style={sliderStyles}
          value={filtersDaysActive}
          onChange={handleDaysActiveChange}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-custom"
          step={1}
          valueLabelDisplay="auto"
          marks={createMarks([0, 30])}
          min={0}
          max={30}
        />
      </FormControl>

      <FormControl component="fieldset" style={{ marginTop: 20 }}>
        <FiltersFormLabel label={"Sort Results by"} />
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
          <FormControlLabel
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
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default SearchFilters;
