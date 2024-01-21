export const OrganizationType = {
  COMPANY: "Company",
  UNIVERSITY: "University",
  PUBLIC: "Public"
};

export interface IVerificationOrganization {
  type: string;
  name: string;
  logo: string;
  organizationId: string;
  domains: string[];
}

export const PUBLIC_ORGANIZATION: IVerificationOrganization = {
  type: OrganizationType.PUBLIC,
  name: "Personal email address",
  logo: "public_icon.png",
  organizationId: "PUBLIC",
  domains: ["example.com"]
};
