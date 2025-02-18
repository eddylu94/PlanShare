// Third-party libraries
import React, { useState } from "react";
import Scrollbar from "react-custom-scrollbars";
import Measure from "react-measure";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

// Components
import FiltersFormLabel from "@components/SharedComponents/filter-label";

// Utilities
import { SORT_BY } from "./search-utils";
import { ISearchFiltersProps } from "./search-utils";
import { DEVICE_MODE } from "@utils/constants";
import { useDeviceMode } from "@utils/utils";
import { Autocomplete, TextField } from "@mui/material";

const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'";

const SearchFilters = (props: ISearchFiltersProps) => {
  const {
    isDrawer,
    filtersNeighborhoods,
    filtersSubscriptionNeighborhoods,
    filtersSubscriptionCategories,
    // filtersGroupSize,
    filtersPrice,
    filtersSortBy,
    // filtersDaysActive,
    toggleFiltersSubscriptionCategory,
    handleNeighborhoodsChange,
    // handleGroupSizeChange,
    handlePriceChange,
    handleSortByChange
    // handleDaysActiveChange
  } = props;

  const deviceMode = useDeviceMode();

  const [contentHeight, setContentHeight] = useState(0);

  const subscriptionCategoryCheckboxes = filtersSubscriptionCategories.map(
    (category, index) => {
      return (
        <FormControlLabel
          key={"filters-category-" + index}
          style={{ color: "#000000", marginTop: 2, marginBottom: 3 }}
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
            <div className="search-filter-category-and-icon">
              <img
                className="search-filter-category-icon"
                src={category.image}
                alt={category.name}
              />
              <Typography
                style={{
                  fontSize: 15,
                  color: "#555555",
                  fontFamily: FONT_FAMILY
                }}
              >
                {category.name}
              </Typography>
            </div>
          }
        />
      );
    }
  );

  const valuetext = (value: number) => `${value}°C`;

  const filtersRadioStyles = {
    padding: 0,
    margin: "5px 5px 5px 20px",
    color: "#6C5DBD"
  };

  const createMarks = (values: number[], isCurrency?: boolean) =>
    values.map(value => ({
      value,
      label: isCurrency ? "$" + value.toString() : value.toString()
    }));

  const sliderStyles = {
    marginLeft: 12,
    width: 180,
    color: "#6C5DBD"
  };

  const neighborhoodsOptions = Object.entries(filtersNeighborhoods).map(
    ([key, value]) => ({
      label: value,
      value: key
    })
  );

  return (
    <Scrollbar
      autoHide
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "20px 10px 20px 20px",
        height: contentHeight,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        ...(deviceMode === DEVICE_MODE.MOBILE
          ? {
              width: "calc(100% - 20px)"
            }
          : {
              width: 250,
              minWidth: 250,
              maxWidth: 250,
              boxShadow: "0px 0px 10px #d8d8d8"
            })
      }}
    >
      <Measure
        bounds
        onResize={contentRect => {
          setContentHeight(contentRect.bounds?.height ?? 0);
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef}>
            <div
              className={isDrawer ? "filter-pane" : "filter-pane search-pane"}
              style={{ boxShadow: "none" }}
            >
              <FormControl component="fieldset" style={{ flexShrink: 0 }}>
                <FiltersFormLabel label={"Category"} />
                <FormGroup>{subscriptionCategoryCheckboxes}</FormGroup>
              </FormControl>

              <FormControl
                component="fieldset"
                style={{ flexShrink: 0, marginTop: 20 }}
              >
                <FiltersFormLabel label={"Price"} />
                <Slider
                  size="small"
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
                <FiltersFormLabel label={"Communities"} />
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={neighborhoodsOptions
                    .sort((a, b) => {
                      const labelA = a.label.toUpperCase(); // Ignore case sensitivity
                      const labelB = b.label.toUpperCase(); // Ignore case sensitivity
                      if (labelA < labelB) {
                        return -1;
                      }
                      if (labelA > labelB) {
                        return 1;
                      }
                      return 0; // If equal
                    })
                    .filter(opt => {
                      // Remove selected options from options list
                      const val = filtersSubscriptionNeighborhoods;
                      return !val
                        .map(valOpt => valOpt.label)
                        .includes(opt.label);
                    })}
                  getOptionLabel={option => option.label}
                  filterSelectedOptions
                  renderInput={params => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={
                        filtersSubscriptionNeighborhoods.length > 0
                          ? ""
                          : "Ex. North Park"
                      }
                    />
                  )}
                  onChange={(_e, val) => handleNeighborhoodsChange(val)}
                  value={filtersSubscriptionNeighborhoods}
                />
              </FormControl>

              {/* <FormControl
								component="fieldset"
								style={{ flexShrink: 0, marginTop: 20 }}
							>
								<FiltersFormLabel label={"Group Size"} />
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
							</FormControl> */}

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
                      <Typography
                        style={{
                          fontSize: 15,
                          color: "#333",
                          fontFamily: FONT_FAMILY
                        }}
                      >
                        {"Date (newest at top)"}
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value={SORT_BY.DATE_ASC}
                    control={<Radio style={filtersRadioStyles} />}
                    label={
                      <Typography
                        style={{
                          fontSize: 15,
                          color: "#333",
                          fontFamily: FONT_FAMILY
                        }}
                      >
                        {"Date (oldest at top)"}
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        )}
      </Measure>
    </Scrollbar>
  );
};

export default SearchFilters;
