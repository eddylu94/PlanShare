interface IOrganizationCategory {
  [key: string]: {
    name: string;
    organizationCategoryId: string;
  };
}

interface IOrganization {
  [key: string]: {
    type: string;
    name: string;
    logo: string;
    organizationId: string;
    domains: string[];
  };
}

export const ORGANIZATION_CATEGORY: IOrganizationCategory = {
  UNIVERSITY: {
    organizationCategoryId: "UNIVERSITY",
    name: "University"
  },
  COMPANY: {
    organizationCategoryId: "COMPANY",
    name: "Company"
  }
};

const organizationCategoriesIds = [
  ORGANIZATION_CATEGORY.UNIVERSITY.organizationCategoryId,
  ORGANIZATION_CATEGORY.COMPANY.organizationCategoryId
];

export const organizationCategories = organizationCategoriesIds.map(
  id => ORGANIZATION_CATEGORY[id]
);

const Companies = [
	{ name: "Accenture", organizationId: "ACCENTURE", domains: ["accenture.com"], logo: "accenture.png" },
	{ name: "Acorns", organizationId: "ACCORNS", domains: ["acorns.com"], logo: "acorns.png" },
	{ name: "Addepar", organizationId: "ADDEPAR", domains: ["addepar.com"], logo: "addepar.png" },
	{ name: "Adobe", organizationId: "ADOBE", domains: ["adobe.com"], logo: "adobe.png" },
	{ name: "Adyen", organizationId: "ADYEN", domains: ["adyen.com"], logo: "adyen.png" },
	{ name: "Affirm", organizationId: "AFFIRM", domains: ["affirm.com"], logo: "affirm.png" },
	{ name: "Airbnb", organizationId: "AIRBNB", domains: ["airbnb.com"], logo: "airbnb.png" },
	{ name: "Airtable", organizationId: "AIRTABLE", domains: ["airtable.com"], logo: "airtable.png" },
	{ name: "Akamai", organizationId: "AKAMAI", domains: ["akamai.com"], logo: "akamai.png" },
	{ name: "Alaska Airlines", organizationId: "ALAKSA_AIRLINES", domains: ["alaskaair.com"], logo: "alaska_airlines.png" },
	{ name: "Albertsons", organizationId: "ALBERTSONS", domains: ["albertsons.com"], logo: "albertsons.png" },
	{ name: "Alibaba", organizationId: "ALIBABA", domains: ["alibaba-inc.com"], logo: "alibaba.png" },
	{ name: "Ally", organizationId: "ALLY", domains: ["ally.com"], logo: "ally.png" },
	{ name: "Amazon", organizationId: "AMAZON", domains: ["amazon.com"], logo: "amazon.png" },
	{ name: "AMD", organizationId: "AMD", domains: ["amd.com"], logo: "amd.png" },
	{ name: "American Airlines", organizationId: "AMERICAN_AIRLINES", domains: ["aa.com"], logo: "american_airlines.png" },
	{ name: "American Express", organizationId: "AMERICAN_EXPRESS", domains: ["aexp.com"], logo: "american_express.png" },
	{ name: "Amplitude", organizationId: "AMPLITUDE", domains: ["amplitude.com"], logo: "amplitude.png" },
	{ name: "Analog Devices", organizationId: "ANALOG_DEVICES", domains: ["analog.com"], logo: "analog_devices.png" },
	{ name: "Ancestry", organizationId: "ANCESTRY", domains: ["ancestry.com"], logo: "ancestry.png" },
	{ name: "Apple", organizationId: "APPLE", domains: ["apple.com"], logo: "apple.png" },
	{ name: "Atlassian", organizationId: "ATLASSIAN", domains: ["atlassian.com"], logo: "atlassian.png" },
	{ name: "Attentive", organizationId: "ATTENTIVE", domains: ["attentive.com"], logo: "attentive.png" },
	{ name: "Baidu", organizationId: "BAIDU", domains: ["baidu.com"], logo: "baidu.png" },
	{ name: "Bank of America", organizationId: "BANK_OF_AMERICA", domains: ["bofa.com"], logo: "bank_of_america.png" },
	{ name: "Benchling", organizationId: "BENCHLING", domains: ["benchling.com"], logo: "benchling.png" },
	{ name: "BlackRock", organizationId: "BLACKROCK", domains: ["blackrock.com"], logo: "blackrock.png" },
	{ name: "Blizzard Entertainment", organizationId: "BLIZZARD", domains: ["blizzard.com"], logo: "blizzard.png" },
	{ name: "Bloomberg", organizationId: "BLOOMBERG", domains: ["bloomberg.net"], logo: "bloomberg.png" },
	{ name: "Blue Origin", organizationId: "BLUE_ORIGIN", domains: ["blueorigin.com"], logo: "blue_origin.png" },
	{ name: "Bosch Global", organizationId: "BOX", domains: ["box.com"], logo: "box.png" },
	{ name: "Brex", organizationId: "BREX", domains: ["brex.com"], logo: "brex.png" },
	{ name: "Broadcom", organizationId: "BROADCOM", domains: ["broadcom.com"], logo: "broadcom.png" },
	{ name: "Bumble", organizationId: "BUMBLE", domains: ["team.bumble.com"], logo: "bumble.png" },
	{ name: "ByteDance", organizationId: "BYTEDANCE", domains: ["bytedance.com"], logo: "bytedance.png" },
	{ name: "Capital One", organizationId: "CAPITAL_ONE", domains: ["capitalone.com"], logo: "capitalone.png" },
	{ name: "Carta", organizationId: "CARTA", domains: ["carta.com"], logo: "carta.png" },
	{ name: "Chime", organizationId: "CHIME", domains: ["chimecard.com"], logo: "chime.png" },
	{ name: "Ciena", organizationId: "CIENA", domains: ["ciena.com"], logo: "ciena.png" },
	{ name: "Cisco", organizationId: "CISCO", domains: ["cisco.com"], logo: "cisco.png" },
	{ name: "Citi", organizationId: "CITI", domains: ["citigroup.com"], logo: "citi.png" },
	{ name: "Citrix", organizationId: "CITRIX", domains: ["citrix.com"], logo: "citrix.png" },
	{ name: "Cloudera", organizationId: "CLOUDERA", domains: ["cloudera.com"], logo: "cloudera.png" },
	{ name: "Cloudflare", organizationId: "CLOUDFLARE", domains: ["cloudflare.com"], logo: "cloudflare.png" },
	{ name: "Coinbase", organizationId: "COINBASE", domains: ["coinbase.com"], logo: "coinbase.png" },
	{ name: "Confluent", organizationId: "CONFLUENT", domains: ["confluent.io"], logo: "confluent.png" },
	{ name: "Course Hero", organizationId: "COURSE_HERO", domains: ["coursehero.com"], logo: "coursehero.png" },
	{ name: "Coursera", organizationId: "COURSERA", domains: ["coursera.org"], logo: "coursera.png" },
	{ name: "Cruise", organizationId: "CRUISE", domains: ["getcruise.com"], logo: "cruise.png" },
	{ name: "Databricks", organizationId: "DATABRICKS", domains: ["databricks.com"], logo: "databricks.png" },
	{ name: "Datadog", organizationId: "DATADOG", domains: ["datadoghq.com"], logo: "datadog.png" },
	{ name: "Dell Technologies", organizationId: "DELL", domains: ["dell.com"], logo: "dell.png" },
	{ name: "Deloitte", organizationId: "DELOITTE", domains: ["deloitte.com"], logo: "deloitte.png" },
	{ name: "The D. E. Shaw Group", organizationId: "DESHAW", domains: ["deshaw.com"], logo: "deshaw.png" },
	{ name: "DigitalOcean", organizationId: "DIGITAL_OCEAN", domains: ["digitalocean.com"], logo: "digital_ocean.png" },
	{ name: "Discord", organizationId: "DISCORD", domains: ["discordapp.com"], logo: "discord.png" },
	{ name: "Disney", organizationId: "DISNEY", domains: ["disney.com"], logo: "disney.png" },
	{ name: "DoorDash", organizationId: "DOORDASH", domains: ["doordash.com"], logo: "doordash.png" },
	{ name: "Dropbox", organizationId: "DROPBOX", domains: ["dropbox.com"], logo: "dropbox.png" },
	{ name: "Duolingo", organizationId: "DUOLINGO", domains: ["duolingo.com"], logo: "duolingo.png" },
	{ name: "Electronic Arts", organizationId: "EA", domains: ["ea.com"], logo: "ea.png" },
	{ name: "eBay", organizationId: "EBAY", domains: ["ebay.com"], logo: "ebay.png" },
	{ name: "Elastic", organizationId: "ELASTIC", domains: ["elasticsearch.com"], logo: "elastic.png" },
	{ name: "Epic", organizationId: "EPIC", domains: ["epic.com"], logo: "epic.png" },
	{ name: "Epic Games", organizationId: "EPIC_GAMES", domains: ["epicgames.com"], logo: "epic_games.png" },
	{ name: "Ericsson", organizationId: "ERICSSON", domains: ["ericsson.com"], logo: "ericsson.png" },
	{ name: "Etsy", organizationId: "ETSY", domains: ["etsy.com"], logo: "etsy.png" },
	{ name: "Expedia", organizationId: "EXPEDIA", domains: ["expedia.com"], logo: "expedia.png" },
	{ name: "Faire", organizationId: "FAIRE", domains: ["faire.com"], logo: "faire.png" },
	{ name: "Fast Enterprises", organizationId: "FAST", domains: ["fastcompany.com"], logo: "fast.png" },
	{ name: "Fidelity Investments", organizationId: "FIDELITY", domains: ["fidelity.com"], logo: "fidelity.png" },
	{ name: "Figma", organizationId: "FIGMA", domains: ["figma.com"], logo: "figma.png" },
	{ name: "Flatiron Health", organizationId: "FLATIRON_HEALTH", domains: ["flatiron.com"], logo: "flatiron.png" },
	{ name: "Flexport", organizationId: "FLEXPORT", domains: ["flexport.com"], logo: "flexport.png" },
	{ name: "Foursquare", organizationId: "FOURSQUARE", domains: ["foursquare.com"], logo: "foursquare.png" },
	{ name: "GE", organizationId: "GE", domains: ["ge.com"], logo: "ge.png" },
	{ name: "Genentech", organizationId: "GENENTECH", domains: ["gene.com"], logo: "genentech.png" },
	{ name: "GitHub", organizationId: "GITHUB", domains: ["github.com"], logo: "github.png" },
	{ name: "GitLab", organizationId: "GITLAB", domains: ["gitlab.com"], logo: "gitlab.png" },
	{ name: "Glassdoor", organizationId: "GLASSDOOR", domains: ["glassdoor.com"], logo: "glassdoor.png" },
	{ name: "General Motors", organizationId: "GM", domains: ["gm.com"], logo: "gm.png" },
	{ name: "GoDaddy", organizationId: "GODADDY", domains: ["godaddy.com"], logo: "godaddy.png" },
	{ name: "Goldman Sachs", organizationId: "GOLDMAN_SACHS", domains: ["gs.com"], logo: "goldman_sachs.png" },
	{ name: "Google", organizationId: "GOOGLE", domains: ["google.com"], logo: "google.png" },
	{ name: "Grammarly", organizationId: "GRAMMARLY", domains: ["grammarly.com"], logo: "grammarly.png" },
	{ name: "Groupon", organizationId: "GROUPON", domains: ["groupon.com"], logo: "groupon.png" },
	{ name: "Grubhub", organizationId: "GRUBHUB", domains: ["grubhub.com"], logo: "grubhub.png" },
	{ name: "Hopper", organizationId: "HOPPER", domains: ["hopper.com"], logo: "hopper.png" },
	{ name: "Houzz", organizationId: "HOUZZ", domains: ["houzz.com"], logo: "houzz.png" },
	{ name: "HPE", organizationId: "HPE", domains: ["hpe.com"], logo: "hpe.png" },
	{ name: "Hudson River Trading", organizationId: "HRT", domains: ["hudson-trading.com"], logo: "hrt.png" },
	{ name: "Huawei", organizationId: "HUAWEI", domains: ["huawei.com"], logo: "huawei.png" },
	{ name: "HubSpot", organizationId: "HUBSPOT", domains: ["hubspot.com"], logo: "hubspot.png" },
	{ name: "IBM", organizationId: "IBM", domains: ["ibm.com"], logo: "ibm.png" },
	{ name: "Indeed", organizationId: "INDEED", domains: ["indeed.com"], logo: "indeed.png" },
	{ name: "Infosys", organizationId: "INFOSYS", domains: ["infosys.com"], logo: "infosys.png" },
	{ name: "Instacart", organizationId: "INSTACART", domains: ["instacart.com"], logo: "instacart.png" },
	{ name: "Intel", organizationId: "INTEL", domains: ["intel.com"], logo: "intel.png" },
	{ name: "Intercom", organizationId: "INTERCOM", domains: ["intercom.io"], logo: "intercom.png" },
	{ name: "Intuit", organizationId: "INTUIT", domains: ["intuit.com"], logo: "intuit.png" },
	{ name: "Intuitive", organizationId: "INTUITIVE", domains: ["intusurg.com"], logo: "intuitive.png" },
	{ name: "Jane Street", organizationId: "JANE_STREET", domains: ["janestreet.com"], logo: "janestreet.png" },
	{ name: "JPMorgan Chase", organizationId: "JPMORGAN_CHASE", domains: ["jpmorgan.com"], logo: "jpmorgan_chase.png" },
	{ name: "Juniper Networks", organizationId: "JUNIPER_NETWORKS", domains: ["juniper.net"], logo: "juniper_networks.png" },
	{ name: "Klarna", organizationId: "KLARNA", domains: ["klarna.com"], logo: "klarna.png" },
	{ name: "KPMG", organizationId: "KPMG", domains: ["kpmg.com"], logo: "kpmg.png" },
	{ name: "Lattice", organizationId: "LATTICE", domains: ["lattice.com"], logo: "lattice.png" },
	{ name: "LinkedIn", organizationId: "LINKEDIN", domains: ["linkedin.com"], logo: "linkedin.png" },
	{ name: "Lockheed Martin", organizationId: "LOCKHEED_MARTIN", domains: ["lockheedmartin.com"], logo: "lockheedmartin.png" },
	{ name: "Lyft", organizationId: "LYFT", domains: ["lyft.com"], logo: "lyft.png" },
	{ name: "Macy's", organizationId: "MACYS", domains: ["macys.com"], logo: "macys.png" },
	{ name: "McKinsey", organizationId: "MCKINSEY", domains: ["mckinsey.com"], logo: "mckinsey.png" },
	{ name: "Meta", organizationId: "META", domains: ["fb.com"], logo: "meta.png" },
	{ name: "Micron Technology", organizationId: "MICRON_TECHNOLOGY", domains: ["micron.com"], logo: "micron.png" },
	{ name: "Microsoft", organizationId: "MICROSOFT", domains: ["microsoft.com"], logo: "microsoft.png" },
	{ name: "MITRE", organizationId: "MITRE", domains: ["mitre.org"], logo: "mitre.png" },
	{ name: "MongoDB", organizationId: "MONGODB", domains: ["mongodb.com"], logo: "mongodb.png" },
	{ name: "Morgan Stanley", organizationId: "MORGAN_STANLEY", domains: ["morganstanley.com"], logo: "morgan_stanley.png" },
	{ name: "Mozilla", organizationId: "MOZILLA", domains: ["mozilla.org"], logo: "mozilla.png" },
	{ name: "NetApp", organizationId: "NETAPP", domains: ["netapp.com"], logo: "netapp.png" },
	{ name: "Netflix", organizationId: "NETFLIX", domains: ["netflix.com"], logo: "netflix.png" },
	{ name: "Nextdoor", organizationId: "NEXTDOOR", domains: ["nextdoor.com"], logo: "nextdoor.png" },
	{ name: "NI", organizationId: "NI", domains: ["ni.com"], logo: "ni.png" },
	{ name: "Nokia", organizationId: "NOKIA", domains: ["nokia.com"], logo: "nokia.png" },
	{ name: "Nordstrom", organizationId: "NORDSTROM", domains: ["nordstrom.com"], logo: "nordstrom.png" },
	{ name: "Northrop Grumman", organizationId: "NORTHROP_GRUMMAN", domains: ["ngc.com"], logo: "northrop_grumman.png" },
	{ name: "Nuance Communications", organizationId: "NUANCE", domains: ["nuance.com"], logo: "nuance.png" },
	{ name: "Nuro", organizationId: "NURO", domains: ["nuro.ai"], logo: "nuro.png" },
	{ name: "Nvidia", organizationId: "NVIDIA", domains: ["nvidia.com"], logo: "nvidia.png" },
	{ name: "OfferUp", organizationId: "OFFERUP", domains: ["offerupnow.com"], logo: "offerup.png" },
	{ name: "Okta", organizationId: "OKTA", domains: ["okta.com"], logo: "okta.png" },
	{ name: "OpenAI", organizationId: "OPENAI", domains: ["openai.com"], logo: "openai.png" },
	{ name: "Opendoor", organizationId: "OPENDOOR", domains: ["opendoor.com"], logo: "opendoor.png" },
	{ name: "OpenSea", organizationId: "OPENSEA", domains: ["opensea.io"], logo: "opensea.png" },
	{ name: "Oracle", organizationId: "ORACLE", domains: ["oracle.com"], logo: "oracle.png" },
	{ name: "PagerDuty", organizationId: "PAGERDUTY", domains: ["pagerduty.com"], logo: "pagerduty.png" },
	{ name: "Palantir", organizationId: "PALANTIR", domains: ["palantir.com"], logo: "palantir.png" },
	{ name: "Palo Alto Networks", organizationId: "PALO_ALTO_NETWORKS", domains: ["paloaltonetworks.com"], logo: "palo_alto_networks.png" },
	{ name: "Pandora", organizationId: "PANDORA", domains: ["pandora.com"], logo: "pandora.png" },
	{ name: "PayPal", organizationId: "PAYPAL", domains: ["paypal.com"], logo: "paypal.png" },
	{ name: "Pinterest", organizationId: "PINTEREST", domains: ["pinterest.com"], logo: "pinterest.png" },
	{ name: "Plaid", organizationId: "PLAID", domains: ["plaid.com"], logo: "plaid.png" },
	{ name: "Qualcomm", organizationId: "QUALCOMM", domains: ["qualcomm.com"], logo: "qualcomm.png" },
	{ name: "Qualtrics", organizationId: "QUALTRICS", domains: ["qualtrics.com"], logo: "qualtrics.png" },
	{ name: "Quora", organizationId: "QUORA", domains: ["quora.com"], logo: "quora.png" },
	{ name: "Rakuten", organizationId: "RAKUTEN", domains: ["rakuten.com"], logo: "rakuten.png" },
	{ name: "Raytheon", organizationId: "RAYTHEON", domains: ["raytheon.com"], logo: "raytheon.png" },
	{ name: "Red Hat", organizationId: "RED_HAT", domains: ["redhat.com"], logo: "redhat.png" },
	{ name: "Reddit", organizationId: "REDDIT", domains: ["reddit.com"], logo: "reddit.png" },
	{ name: "Redfin", organizationId: "REDFIN", domains: ["redfin.com"], logo: "redfin.png" },
	{ name: "Rippling", organizationId: "RIPPLING", domains: ["rippling.com"], logo: "rippling.png" },
	{ name: "Rivian", organizationId: "RIVIAN", domains: ["rivian.com"], logo: "rivian.png" },
	{ name: "Robinhood", organizationId: "ROBINHOOD", domains: ["robinhood.com"], logo: "robinhood.png" },
	{ name: "Roblox", organizationId: "ROBLOX", domains: ["roblox.com"], logo: "roblox.png" },
	{ name: "Rocket Mortgage", organizationId: "ROCKET_MORTGAGE", domains: ["rocketmortgage.com"], logo: "rocket_mortgage.png" },
	{ name: "Roku", organizationId: "ROKU", domains: ["roku.com"], logo: "roku.png" },
	{ name: "Rubrik", organizationId: "RUBRIK", domains: ["rubrik.com"], logo: "rubrik.png" },
	{ name: "Salesforce", organizationId: "SALESFORCE", domains: ["salesforce.com"], logo: "salesforce.png" },
	{ name: "Samsara", organizationId: "SAMSARA", domains: ["samsara.com"], logo: "samsara.png" },
	{ name: "SAP", organizationId: "SAP", domains: ["sap.com"], logo: "sap.png" },
	{ name: "Scale AI", organizationId: "SCALE_AI", domains: ["scale.ai"], logo: "scale_ai.png" },
	{ name: "ServiceNow", organizationId: "SERVICENOW", domains: ["servicenow.com"], logo: "servicenow.png" },
	{ name: "Shopify", organizationId: "SHOPIFY", domains: ["shopify.com"], logo: "shopify.png" },
	{ name: "Slalom", organizationId: "SLALOM", domains: ["slalom.com"], logo: "slalom.png" },
	{ name: "Smartsheet", organizationId: "SMARTSHEET", domains: ["smartsheet.com"], logo: "smartsheet.png" },
	{ name: "Snap", organizationId: "SNAP", domains: ["snapchat.com"], logo: "snap.png" },
	{ name: "Snowflake", organizationId: "SNOWFLAKE", domains: ["snowflake.com"], logo: "snowflake.png" },
	{ name: "SpaceX", organizationId: "SPACEX", domains: ["spacex.com"], logo: "spacex.png" },
	{ name: "Splunk", organizationId: "SPLUNK", domains: ["splunk.com"], logo: "splunk.png" },
	{ name: "Spotify", organizationId: "SPOTIFY", domains: ["spotify.com"], logo: "spotify.png" },
	{ name: "Square", organizationId: "SQUARE", domains: ["square.com"], logo: "square.png" },
	{ name: "Squarespace", organizationId: "SQUARESPACE", domains: ["squarespace.com"], logo: "squarespace.png" },
	{ name: "Stripe", organizationId: "STRIPE", domains: ["stripe.com"], logo: "stripe.png" },
	{ name: "Tableau Software", organizationId: "TABLEAU_SOFTWARE", domains: ["tableau.com"], logo: "tableau.png" },
	{ name: "TD bank", organizationId: "TD_BANK", domains: ["td.com"], logo: "td.png" },
	{ name: "Tencent", organizationId: "TENCENT", domains: ["tencent.com"], logo: "tencent.png" },
	{ name: "Tesla", organizationId: "TESLA", domains: ["tesla.com"], logo: "tesla.png" },
	{ name: "Texas Instruments", organizationId: "TI", domains: ["ti.com"], logo: "ti.png" },
	{ name: "Tinder", organizationId: "TINDER", domains: ["tinder.com"], logo: "tinder.png" },
	{ name: "Toast, Inc.", organizationId: "TOAST", domains: ["toa.st"], logo: "toast.png" },
	{ name: "Trend Micro", organizationId: "TREND_MICRO", domains: ["trendmicro.com"], logo: "trend_micro.png" },
	{ name: "Twilio", organizationId: "TWILIO", domains: ["twilio.com"], logo: "twilio.png" },
	{ name: "Twitch", organizationId: "TWITCH", domains: ["twitch.tv"], logo: "twitch.png" },
	{ name: "Twitter", organizationId: "TWITTER", domains: ["twitter.com"], logo: "twitter.png" },
	{ name: "Two Sigma", organizationId: "TWO_SIGMA", domains: ["twosigma.com"], logo: "two_sigma.png" },
	{ name: "Uber", organizationId: "UBER", domains: ["uber.com"], logo: "uber.png" },
	{ name: "Ubisoft", organizationId: "UBISOFT", domains: ["ubisoft.com"], logo: "ubisoft.png" },
	{ name: "UiPath", organizationId: "UIPATH", domains: ["uipath.com"], logo: "uipath.png" },
	{ name: "Unity", organizationId: "UNITY", domains: ["unity3d.com"], logo: "unity.png" },
	{ name: "Verkada", organizationId: "VERKADA", domains: ["verkada.com"], logo: "verkada.png" },
	{ name: "Visa", organizationId: "VISA", domains: ["visa.com"], logo: "visa.png" },
	{ name: "VMware", organizationId: "VMWARE", domains: ["vmware.com"], logo: "vmware.png" },
	{ name: "Walmart", organizationId: "WALMART", domains: ["walmart.com"], logo: "walmart.png" },
	{ name: "Wayfair", organizationId: "WAYFAIR", domains: ["wayfair.com"], logo: "wayfair.png" },
	{ name: "Workday", organizationId: "WORKDAY", domains: ["workday.com"], logo: "workday.png" },
	{ name: "Yelp", organizationId: "YELP", domains: ["yelp.com"], logo: "yelp.png" },
	{ name: "Zillow", organizationId: "ZILLOW", domains: ["zillow.com"], logo: "zillow.png" },
	{ name: "Zoom", organizationId: "ZOOM", domains: ["zoom.com"], logo: "zoom.png" },
	{ name: "Zoox", organizationId: "ZOOX", domains: ["zoox.com"], logo: "zoox.png" },
	{ name: "Zulily", organizationId: "ZULILY", domains: ["zulily.com"], logo: "zulily.png" },
	{ name: "Zynga", organizationId: "ZYNGA", domains: ["zynga.com"], logo: "zynga.png" },
	// {
  //   organizationId: "MICROSOFT_COMPANY",
  //   name: "Microsoft",
  //   logo: "https://planshare.io/msft_logo.png",
  //   domains: ["microsoft.com"]
  // },
  // {
  //   organizationId: "LINKEDIN_COMPANY",
  //   name: "LinkedIn",
  //   logo: "https://planshare.io/lnkd_logo.png",
  //   domains: ["linkedin.com"]
  // },
  // {
  //   organizationId: "GITHUB_COMPANY",
  //   name: "GitHub",
  //   logo: "https://planshare.io/github_logo.png",
  //   domains: ["github.com"]
  // },
  // {
  //   organizationId: "AMAZON_COMPANY",
  //   name: "GitHub",
  //   logo: "https://planshare.io/amzn_logo.png",
  //   domains: ["amazon.com"]
  // },
  // {
  //   organizationId: "FACEBOOK_COMPANY",
  //   name: "Facebook",
  //   logo: "https://planshare.io/fb_logo.png",
  //   domains: ["fb.com"]
  // },
  // {
  //   organizationId: "APPLE_COMPANY",
  //   name: "Apple",
  //   logo: "https://planshare.io/aapl_logo.png",
  //   domains: ["apple.com"]
  // },
  // {
  //   organizationId: "GOOGLE_COMPANY",
  //   name: "Google",
  //   logo: "https://planshare.io/goog_logo.png",
  //   domains: ["google.com"]
  // },
];

const Universities = [
	{
    organizationId: "MCGILL_UNIVERSITY",
    name: "McGill University",
    logo: "https://planshare.io/mcgill_u_logo.png",
    domains: ["mail.mcgill.ca", "mcgill.ca"]
  },
  {
    organizationId: "UNIVERSITY_OF_TORONTO",
    name: "University of Toronto",
    logo: "https://planshare.io/u_of_toronto_logo.png",
    domains: ["mail.utoronto.ca"]
  },
  {
    organizationId: "QUEENS_UNIVERSITY",
    name: "Queen's University",
    logo: "https://planshare.io/queensu_logo.png",
    domains: ["queensu.ca"]
  },
  {
    organizationId: "WASHU_ST_LOUIS",
    name: "Washington University, St. Louis",
    logo: "https://planshare.io/washu_stl_logo.png",
    domains: ["wustl.edu"]
  },
  {
    organizationId: "UNIVERSITY_OF_WASHINGTON",
    name: "University of Washington",
    logo: "https://planshare.io/u_of_wa_logo.png",
    domains: ["uw.edu"]
  }
];

const organizations: IOrganization = {};

Companies.forEach(company => {
	organizations[company.organizationId] = {
		...company,
		logo: `https://planshare.io/companies/${company.logo}`,
		type: ORGANIZATION_CATEGORY.COMPANY.name,
	};
});

Universities.forEach(university => {
	organizations[university.organizationId] = {
		...university,
		type: ORGANIZATION_CATEGORY.UNIVERSITY.name,
	};
});

export const ORGANIZATION = organizations;

const companyIds = Companies.map(company => company.organizationId);

const univerityIds = [
  ORGANIZATION.MCGILL_UNIVERSITY.organizationId,
  ORGANIZATION.UNIVERSITY_OF_TORONTO.organizationId,
  ORGANIZATION.QUEENS_UNIVERSITY.organizationId,
  ORGANIZATION.WASHU_ST_LOUIS.organizationId,
  ORGANIZATION.UNIVERSITY_OF_WASHINGTON.organizationId
] as string[];

export const retrieveOrganizations = (type: string) => {
  let ids;
  switch (type) {
    case ORGANIZATION_CATEGORY.COMPANY.organizationCategoryId:
      ids = companyIds;
      break;
    case ORGANIZATION_CATEGORY.UNIVERSITY.organizationCategoryId:
      ids = univerityIds;
      break;
    default:
      ids = companyIds;
      break;
  }

  return ids.map(id => ORGANIZATION[id]);
};

export const retrieveOrganizationByDomain = (domain: string) => {
  const ids = Object.keys(ORGANIZATION);
  return ids
    .map(id => ORGANIZATION[id])
    .find(organization => organization.domains.includes(domain));
};

export const retrieveOrganizationById = (id: string) => ORGANIZATION[id];
