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
  GOOGLE_COMPANY: {
    organizationId: "GOOGLE_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Google",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/992px-Google_%22G%22_Logo.svg.png",
    domains: ["gmail.com"]
  },
  YAHOO_COMPANY: {
    organizationId: "YAHOO_COMPANY",
    type: ORGANIZATION_CATEGORY.COMPANY.name,
    name: "Yahoo",
    logo:
      "https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/uc1yxcrar5kkywol0oo9",
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
  ORGANIZATION.GOOGLE_COMPANY.organizationId,
  ORGANIZATION.YAHOO_COMPANY.organizationId
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
