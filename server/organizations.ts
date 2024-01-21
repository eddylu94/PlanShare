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
	{
    organizationId: "MICROSOFT_COMPANY",
    name: "Microsoft",
    logo: "https://planshare.io/msft_logo.png",
    domains: ["microsoft.com"]
  },
  {
    organizationId: "LINKEDIN_COMPANY",
    name: "LinkedIn",
    logo: "https://planshare.io/lnkd_logo.png",
    domains: ["linkedin.com"]
  },
  {
    organizationId: "GITHUB_COMPANY",
    name: "GitHub",
    logo: "https://planshare.io/github_logo.png",
    domains: ["github.com"]
  },
  {
    organizationId: "AMAZON_COMPANY",
    name: "GitHub",
    logo: "https://planshare.io/amzn_logo.png",
    domains: ["amazon.com"]
  },
  {
    organizationId: "FACEBOOK_COMPANY",
    name: "Facebook",
    logo: "https://planshare.io/fb_logo.png",
    domains: ["fb.com"]
  },
  {
    organizationId: "APPLE_COMPANY",
    name: "Apple",
    logo: "https://planshare.io/aapl_logo.png",
    domains: ["apple.com"]
  },
  {
    organizationId: "GOOGLE_COMPANY",
    name: "Google",
    logo: "https://planshare.io/goog_logo.png",
    domains: ["google.com"]
  },
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

const companyIds = [
  ORGANIZATION.MICROSOFT_COMPANY.organizationId,
  ORGANIZATION.LINKEDIN_COMPANY.organizationId,
  ORGANIZATION.GITHUB_COMPANY.organizationId,
  ORGANIZATION.AMAZON_COMPANY.organizationId,
  ORGANIZATION.FACEBOOK_COMPANY.organizationId,
  ORGANIZATION.APPLE_COMPANY.organizationId,
  ORGANIZATION.GOOGLE_COMPANY.organizationId
];

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
