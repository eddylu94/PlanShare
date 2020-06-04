import React from "react";

interface IRestriction {
  title: string;
  url: string;
  logo: string;
  lastKnownUpdate: Date;
  lastChecked: Date;
  limitations: string[];
  quote: string;
}

const restrictions: IRestriction[] = [
  {
    title: "Spotify Premium",
    url: "https://www.spotify.com/us/legal/premium-family-terms/",
    logo:
      "https://developer.spotify.com/assets/branding-guidelines/icon4@2x.png",
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
    title: "Costco",
    url: "https://www.costco.com/member-privileges-conditions.html",
    logo: "https://cdn.iconscout.com/icon/free/png-256/costco-282448.png",
    lastKnownUpdate: new Date("September 23, 2019"),
    lastChecked: new Date("June 3, 2020"),
    limitations: ["Must reside at same mailing address"],
    quote:
      "Primary and Affiliate Members receive one free Household Card for anyone over the age of 18 and living at the same address. Household Cardholders will be asked to present proof that they live at the same address as either the Primary or Affiliate Member."
  },
  {
    title: "Hulu",
    url: "https://www.hulu.com/terms",
    logo:
      "https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/bk8cux6dapq8qjzylfaj",
    lastKnownUpdate: new Date("September 27, 2019"),
    lastChecked: new Date("June 3, 2020"),
    limitations: ["N/A"],
    quote:
      "Hulu offers the option to personalize use of the Services through the creation of one or more profiles under one account."
  },
  {
    title: "Netflix",
    url: "https://help.netflix.com/legal/termsofuse",
    logo:
      "https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1474467529/zlaaxu2whczitkpkxxk9.jpg",
    lastKnownUpdate: new Date("April 24, 2019"),
    lastChecked: new Date("June 3, 2020"),
    limitations: ["Must reside at same mailing address"],
    quote:
      "The Netflix service and any content viewed through our service are for your personal and non-commercial use only and may not be shared with individuals beyond your household."
  },
  {
    title: "Sling TV",
    url: "https://www.sling.com/offer-details/disclaimers/terms-of-use",
    logo:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/aa/5c/41/aa5c41e2-e131-abfa-c3f6-9649b426a561/source/256x256bb.jpg",
    lastKnownUpdate: new Date("May 11, 2020"),
    lastChecked: new Date("June 3, 2020"),
    limitations: ["Sharing is not allowed"],
    quote:
      "Please be aware that to maintain exclusive control and ensure compliance with these Terms of Use, you may not reveal or share your Login Credentials with anyone."
  }
];

const Feedback = () => {
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
        <div className="info-last-known-update">
          Last known update:{" "}
          <span className="b">{lastKnownUpdate.toDateString()}</span>
        </div>
        <div>
          Last checked: <span className="b">{lastChecked.toDateString()}</span>
        </div>
        <div className="info-required-terms">Required terms:</div>
        <ul>{limitationItems}</ul>
        {quote ? <div className="info-quote">"{quote}"</div> : null}
      </div>
    );
  };

  const list = restrictions.map((restriction, i) =>
    renderRestriction(restriction, i)
  );

  return (
    <div className="page-container" style={{ backgroundColor: "#FFFFFF" }}>
      <h2 className="info-page-header">Subscription Information</h2>
      The following are known restrictions to group plans:
      {list}
    </div>
  );
};

export default Feedback;
