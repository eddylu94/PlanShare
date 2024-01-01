export interface IVerificationOrganization {
  key: string;
  name: string;
  logoSrc: string;
  domain: string;
}

export const Organization: { [key: string]: IVerificationOrganization } = {
  PUBLIC: {
    key: "PUBLIC",
    name: "Personal email address",
    logoSrc: "public_icon.png",
    domain: "example.com"
  },
  MICROSOFT: {
    key: "MICROSOFT",
    name: "Microsoft",
    logoSrc: "msft_logo.png",
    domain: "microsoft.com"
  },
  LINKEDIN: {
    key: "LINKEDIN",
    name: "LinkedIn",
    logoSrc: "lnkd_logo.png",
    domain: "linkedin.com"
  },
  GITHUB: {
    key: "GITHUB",
    name: "GitHub",
    logoSrc: "github_logo.png",
    domain: "github.com"
  },
  AMZN: {
    key: "AMAZON",
    name: "Amazon",
    logoSrc: "amzn_logo.png",
    domain: "amazon.com"
  },
  FB: {
    key: "FACEBOOK",
    name: "Facebook",
    logoSrc: "fb_logo.png",
    domain: "fb.com"
  },
  AAPL: {
    key: "APPLE",
    name: "Apple",
    logoSrc: "aapl_logo.png",
    domain: "apple.com"
  },
  MCGILL_U: {
    key: "MCGILL_U",
    name: "McGill University",
    logoSrc: "mcgill_u_logo.png",
    domain: "mail.mcgill.ca"
  },
  U_OF_TORONTO: {
    key: "U_OF_TORONTO",
    name: "University of Toronto",
    logoSrc: "u_of_toronto_logo.png",
    domain: "mail.utoronto.ca"
  },
  U_OF_WASHINGTON: {
    key: "U_OF_WASHINGTON",
    name: "University of Washington",
    logoSrc: "u_of_wa_logo.png",
    domain: "uw.edu"
  }
};
