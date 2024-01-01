// Third-party libraries
import React, { useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Components
import FiltersFormLabel from "@components/SharedComponents/filter-label";

// Utils
import { IRestriction, InfoCategory, Restrictions } from "./restrictions";

const Info = () => {
  const [selectedCategories, setSelectedCategories] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [searchText, setSearchText] = useState("");
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  const renderRestriction = (restriction: IRestriction, index: number) => {
    const {
      title,
      url,
      logo,
      lastKnownUpdate,
      lastChecked,
      limitations,
      quote
    } = restriction;

    const limitationItems = limitations.map((limitation, i) => (
      <li key={"limitation-" + i}>{limitation}</li>
    ));

    return (
      <div className="info-container" key={"info-container" + index}>
        <div className="info-header">
          <img src={logo} alt={title} className="info-logo" />
          <div className="info-title">{title}</div>
        </div>
        <div className="info-url">
          <a href={`${url}`}>{url}</a>
        </div>
        {lastKnownUpdate ? (
          <div className="info-last-known-update">
            Last known update:{" "}
            <span className="b">{lastKnownUpdate.toDateString()}</span>
          </div>
        ) : null}
        <div>
          Last checked: <span className="b">{lastChecked.toDateString()}</span>
        </div>
        <div className="info-required-terms">Required terms:</div>
        <ul>{limitationItems}</ul>
        {quote ? <div className="info-quote">"{quote}"</div> : null}
      </div>
    );
  };

  const list = Restrictions.filter(
    restriction =>
      selectedCategories.length === 0 ||
      selectedCategories.map(opt => opt.label).includes(restriction.category)
  )
    .filter(restriction =>
      restriction.title
        .toLocaleLowerCase()
        .includes(searchText.toLocaleLowerCase())
    )
    .map((restriction, i) => renderRestriction(restriction, i));

  const categoryOptions = Object.entries(InfoCategory).map(([key, value]) => {
    return {
      label: value,
      value: key
    };
  });

  const scrollBarsStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "calc(100% - 40px)",
    width: "calc(100% + 20px)",
    margin: -10
  };

  return (
    <div
      className="page-container"
      style={{ backgroundColor: "#FFFFFF", alignItems: "center" }}
    >
      <div className="info-page-container">
        <div className="info-page-wrapper">
          <h2 className="info-page-header">Subscription Information</h2>
          <span className="info-page-description">
            Many service providers restrict sharing. The following is a list of
            providers and their sharing limitations as per their terms of
            service.
          </span>

          <div className="info-filters-container">
            <Accordion
              expanded={accordionExpanded}
              onChange={(_e, expanded) => setAccordionExpanded(expanded)}
              style={{ boxShadow: "0px 0px 10px #cccccc", border: "none" }}
              className="info-filters-accordion"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div style={{ color: "#333", fontWeight: 500 }}>
                  Search filters
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="info-filters-wrapper">
                  <FormControl
                    component="fieldset"
                    className="info-filter-form-control"
                  >
                    <FiltersFormLabel label={"Search by name"} />
                    <TextField
                      size="small"
                      placeholder={"Ex. Spotify"}
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                    />
                  </FormControl>

                  <FormControl
                    component="fieldset"
                    className="info-filter-form-control"
                  >
                    <FiltersFormLabel label={"Filter by category"} />
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={categoryOptions.filter(opt => {
                        // Remove selected options from options list
                        const val = selectedCategories;
                        return !val
                          .map(valOpt => valOpt.value)
                          .includes(opt.value);
                      })}
                      getOptionLabel={option => option.label}
                      filterSelectedOptions
                      renderInput={params => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder={
                            selectedCategories.length > 0 ? "" : "Ex. Streaming"
                          }
                        />
                      )}
                      onChange={(_e, val) => setSelectedCategories(val)}
                      value={selectedCategories}
                    />
                  </FormControl>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          <Scrollbars autoHide style={scrollBarsStyle}>
            <div className="info-cards-container">{list}</div>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default Info;
