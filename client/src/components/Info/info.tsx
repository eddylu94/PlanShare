import FiltersFormLabel from "@components/SharedComponents/filter-label";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";

const InfoCategory = {
  MUSIC: "Music",
  STREAMING: "Streaming",
  CLUB_MEMBERSHIP: "Club Membership",
  GAMING: "Gaming"
};

interface IRestriction {
  title: string;
  url: string;
  logo: string;
  lastKnownUpdate?: Date;
  lastChecked: Date;
  limitations: string[];
  quote: string;
  category: string;
}

const restrictions: IRestriction[] = [
  {
    title: "Spotify Premium",
    url: "https://www.spotify.com/us/legal/premium-family-terms/",
    logo: "plans/spotify_music.png",
    category: InfoCategory.MUSIC,
    lastKnownUpdate: new Date("March 30, 2020"),
    lastChecked: new Date("June 3, 2020"),
    limitations: [
      "Must be members of same family",
      "Must reside at same mailing address"
    ],
    quote:
      "In order to be eligible for the Premium Family Subscription, the primary account holder and the subsidiary account holders must be family members residing at the same address."
  },
  {
    title: "Disney+",
    url: "https://help.disneyplus.com/article/disneyplus-en-ca-account-sharing",
    logo: "plans/disney_online_streaming.png",
    category: InfoCategory.STREAMING,
    lastChecked: new Date("Nov 30, 2020"),
    limitations: ["Must reside at same mailing address"],
    quote:
      "You may not share your subscription outside of your household. “Household” means the collection of devices associated with your primary personal residence that are used by the individuals who reside therein."
  },
  {
    title: "Netflix",
    url: "https://help.netflix.com/legal/termsofuse",
    logo: "plans/netflix_online_streaming.png",
    category: InfoCategory.STREAMING,
    lastKnownUpdate: new Date("April 24, 2019"),
    lastChecked: new Date("June 3, 2020"),
    limitations: ["Must reside at same mailing address"],
    quote:
      "The Netflix service and any content viewed through our service are for your personal and non-commercial use only and may not be shared with individuals beyond your household."
  },
  {
    title: "Costco",
    url: "https://www.costco.com/member-privileges-conditions.html",
    logo: "plans/costco.png",
    category: InfoCategory.CLUB_MEMBERSHIP,
    lastKnownUpdate: new Date("September 23, 2019"),
    lastChecked: new Date("June 3, 2020"),
    limitations: ["Must reside at same mailing address"],
    quote:
      "Primary and Affiliate Members receive one free Household Card for anyone over the age of 18 and living at the same address. Household Cardholders will be asked to present proof that they live at the same address as either the Primary or Affiliate Member."
  },
  {
    title: "Hulu",
    url: "https://www.hulu.com/terms",
    logo: "plans/hulu_tv.png",
    category: InfoCategory.STREAMING,
    lastKnownUpdate: new Date("September 27, 2019"),
    lastChecked: new Date("June 3, 2020"),
    limitations: ["N/A"],
    quote:
      "Hulu offers the option to personalize use of the Services through the creation of one or more profiles under one account."
  },
  {
    title: "Sling TV",
    url: "https://www.sling.com/offer-details/disclaimers/terms-of-use",
    logo: "plans/sling_tv.png",
    category: InfoCategory.STREAMING,
    lastKnownUpdate: new Date("May 11, 2020"),
    lastChecked: new Date("June 3, 2020"),
    limitations: ["Sharing is not allowed"],
    quote:
      "Please be aware that to maintain exclusive control and ensure compliance with these Terms of Use, you may not reveal or share your Login Credentials with anyone."
  },
  {
    title: "Prime TV",
    url:
      "https://www.amazon.com/gp/help/customer/display.html?nodeId=GWZ7QXD2X8WL8YE8",
    logo: "/plans/prime_online_streaming.png",
    category: InfoCategory.STREAMING,
    lastChecked: new Date("April 11, 2021"),
    limitations: ["Must reside at same mailing address"],
    quote:
      "Prime members can share certain benefits with another adult in their Amazon Household."
  },
  {
    title: "YouTube TV",
    url: "https://support.google.com/youtubetv/answer/7251139",
    logo: "/plans/youtube_tv.png",
    category: InfoCategory.STREAMING,
    lastChecked: new Date("April 11, 2021"),
    limitations: ["Must be members of same family"],
    quote:
      "As the family manager, you can invite family members (13 or older) to join your family group. ... Live in the same household as the family manager"
  },
  {
    title: "AT&T TV",
    url: "https://www.att.com/support/article/att-tv/KM1354360/",
    logo: "/plans/att_tv.png",
    category: InfoCategory.STREAMING,
    lastChecked: new Date("April 11, 2021"),
    limitations: ["Must reside at same mailing address"],
    quote:
      "You can stream AT&T TVSM on up to 20 compatible devices connected to your home network at the same time. And, use up to three of those streams on the go."
  },
  {
    title: "Apple Music",
    url: "https://www.apple.com/legal/internet-services/itunes/us/terms.html",
    logo: "/plans/apple_music.png",
    category: InfoCategory.MUSIC,
    lastKnownUpdate: new Date("September 16, 2020"),
    lastChecked: new Date("April 11, 2021"),
    limitations: ["Must be members of same family"],
    quote:
      "Family Sharing’s Purchase Sharing feature allows you to share eligible Content among up to six members of a Family."
  },
  {
    title: "Tidal Music",
    url: "https://support.tidal.com/hc/en-us/articles/360004405337-Family",
    logo: "/plans/tidal_music.png",
    category: InfoCategory.MUSIC,
    lastChecked: new Date("April 11, 2021"),
    limitations: ["Must be members of same family"],
    quote:
      "You can add up to 5 additional family members to your Family subscription."
  },
  {
    title: "Amazon Music",
    url:
      "https://www.amazon.com/gp/help/customer/display.html?nodeId=GWGVV6VBWBXHMHQB",
    logo: "/plans/amazon_music.png",
    category: InfoCategory.MUSIC,
    lastChecked: new Date("April 11, 2021"),
    limitations: ["Must be members of same family"],
    quote:
      "This plan allows up to six members of your family to receive all the benefits of Amazon Music Unlimited with a monthly subscription."
  },
  {
    title: "Nintendo Online",
    url:
      "https://en-americas-support.nintendo.com/app/answers/detail/a_id/22521/~/nintendo-switch-online-service-faq",
    logo: "/plans/nintendo_online.png",
    category: InfoCategory.GAMING,
    lastChecked: new Date("April 11, 2021"),
    limitations: ["Must be members of same family"],
    quote:
      "A family membership provides the Nintendo Switch Online service to everyone in the purchaser's family group (up to 8 people)."
  }
];

const Info = () => {
  const [selectedCategories, setSelectedCategories] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [searchText, setSearchText] = useState("");

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

  const list = restrictions
    .filter(
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

  console.log(selectedCategories);

  return (
    <div
      className="page-container"
      style={{ backgroundColor: "#FFFFFF", alignItems: "center" }}
    >
      <div className="info-page-container">
        <div className="info-page-wrapper">
          <h2 className="info-page-header">Subscription Information</h2>
          <span className="i">
            The following are known restrictions to group plans.
          </span>

          <div className="info-filters-container">
            <FormControl
              component="fieldset"
              className="info-filter-form-control"
              style={{ marginTop: 20 }}
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
              style={{ marginTop: 20 }}
            >
              <FiltersFormLabel label={"Filter by category"} />
              <Autocomplete
                multiple
                id="tags-outlined"
                options={categoryOptions.filter(opt => {
                  // Remove selected options from options list
                  const val = selectedCategories;
                  return !val.map(valOpt => valOpt.value).includes(opt.value);
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

          {list}
        </div>
      </div>
    </div>
  );
};

export default Info;
