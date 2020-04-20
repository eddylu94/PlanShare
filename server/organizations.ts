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
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
    domains: ["microsoft.com"]
  },
  LINKEDIN_COMPANY: {
    organizationId: "LINKEDIN_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "LinkedIn",
    logo: "https://1000logos.net/wp-content/uploads/2017/03/LinkedIn-Logo.png",
    domains: ["linkedin.com"]
  },
  GOOGLE_COMPANY: {
    organizationId: "GOOGLE_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Google",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/992px-Google_%22G%22_Logo.svg.png",
    domains: ["google.com"]
  },
  FAKE_GOOGLE_COMPANY: {
    organizationId: "FAKE_GOOGLE_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Fake Google",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/992px-Google_%22G%22_Logo.svg.png",
    domains: ["gmail.com"]
  },
  FAKE_YAHOO_COMPANY: {
    organizationId: "FAKE_YAHOO_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Fake Yahoo",
    logo:
      "https://cdn.vox-cdn.com/thumbor/iMskq3UhvglRywsiicE_Tt6qAIQ=/0x0:2000x1333/920x613/filters:focal(840x507:1160x827):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65300844/mb_yahoo_02.0.jpg",
    domains: ["yahoo.com"]
  },
  MCGILL_UNIVERSITY: {
    organizationId: "MCGILL_UNIVERSITY",
    type: ORGANIZATION_CATEGORY.UNIVERSITY.name,
    name: "McGill University",
    logo:
      "https://a.thumbs.redditmedia.com/nHdGdAx022-fc-lPJ0ZKCVOmY0QVgbjj4_a8waxrdQ0.png",
    domains: ["mcgill.ca", "mail.mcgill.ca"]
  }
};

const companyIds = [
  ORGANIZATION.MICROSOFT_COMPANY.organizationId,
  ORGANIZATION.LINKEDIN_COMPANY.organizationId,
  ORGANIZATION.GOOGLE_COMPANY.organizationId,
  ORGANIZATION.FAKE_GOOGLE_COMPANY.organizationId,
  ORGANIZATION.FAKE_YAHOO_COMPANY.organizationId
];

const univerityIds = [ORGANIZATION.MCGILL_UNIVERSITY.organizationId];

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
