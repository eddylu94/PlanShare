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

export const ORGANIZATION: IOrganization = {
  MICROSOFT_COMPANY: {
    organizationId: "MICROSOFT_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Microsoft",
    logo: "https://planshare.io/msft_logo.png",
    domains: ["microsoft.com"]
  },
  LINKEDIN_COMPANY: {
    organizationId: "LINKEDIN_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "LinkedIn",
    logo: "https://planshare.io/lnkd_logo.png",
    domains: ["linkedin.com"]
  },
  GITHUB_COMPANY: {
    organizationId: "GITHUB_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "GitHub",
    logo: "https://planshare.io/github_logo.png",
    domains: ["github.com"]
  },
  AMAZON_COMPANY: {
    organizationId: "AMAZON_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "GitHub",
    logo: "https://planshare.io/amzn_logo.png",
    domains: ["amazon.com"]
  },
  FACEBOOK_COMPANY: {
    organizationId: "FACEBOOK_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Facebook",
    logo: "https://planshare.io/fb_logo.png",
    domains: ["fb.com"]
  },
  APPLE_COMPANY: {
    organizationId: "APPLE_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Apple",
    logo: "https://planshare.io/aapl_logo.png",
    domains: ["apple.com"]
  },
  GOOGLE_COMPANY: {
    organizationId: "GOOG_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Google",
    logo: "https://planshare.io/goog_logo.png",
    domains: ["google.com"]
  },
  FAKE_GOOGLE_COMPANY: {
    organizationId: "FAKE_GOOGLE_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Fake Google",
    logo: "https://planshare.io/goog_logo.png",
    domains: ["gmail.com"]
  },
  MCGILL_UNIVERSITY: {
    organizationId: "MCGILL_UNIVERSITY",
    type: ORGANIZATION_CATEGORY.UNIVERSITY.name,
    name: "McGill University",
    logo: "https://planshare.io/mcgill_u_logo.png",
    domains: ["mail.mcgill.ca", "mcgill.ca"]
  },
  UNIVERSITY_OF_TORONTO: {
    organizationId: "UNIVERSITY_OF_TORONTO",
    type: ORGANIZATION_CATEGORY.UNIVERSITY.name,
    name: "University of Toronto",
    logo: "https://planshare.io/u_of_toronto_logo.png",
    domains: ["utoronto.ca"]
  },
  QUEENS_UNIVERSITY: {
    organizationId: "QUEENS_UNIVERSITY",
    type: ORGANIZATION_CATEGORY.UNIVERSITY.name,
    name: "Queen's University",
    logo: "https://planshare.io/queensu_logo.png",
    domains: ["queensu.ca"]
  },
  WASHU_ST_LOUIS: {
    organizationId: "WASHU_ST_LOUIS",
    type: ORGANIZATION_CATEGORY.UNIVERSITY.name,
    name: "Washington University, St. Louis",
    logo: "https://planshare.io/washu_stl_logo.png",
    domains: ["wustl.edu"]
  },
  UNIVERSITY_OF_WASHINGTON: {
    organizationId: "UNIVERSITY_OF_WASHINGTON",
    type: ORGANIZATION_CATEGORY.UNIVERSITY.name,
    name: "University of Washington",
    logo: "https://planshare.io/u_of_wa_logo.png",
    domains: ["uw.edu"]
  }
};

const companyIds = [
  ORGANIZATION.MICROSOFT_COMPANY.organizationId,
  ORGANIZATION.LINKEDIN_COMPANY.organizationId,
  ORGANIZATION.GITHUB_COMPANY.organizationId,
  ORGANIZATION.AMAZON_COMPANY.organizationId,
  ORGANIZATION.FACEBOOK_COMPANY.organizationId,
  ORGANIZATION.APPLE_COMPANY.organizationId,
  ORGANIZATION.GOOGLE_COMPANY.organizationId,
  ORGANIZATION.FAKE_GOOGLE_COMPANY.organizationId
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
