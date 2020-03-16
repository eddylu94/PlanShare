export interface IResponse {
  statusCode: number;
  statusMessage: string;
  body: any;
}

export interface ISubscriptionCategory {
  subscriptionCategoryId: string;
  name: string;
}

export interface ISubscriptionBrand {
  subscriptionBrandId: string;
  type: string;
  name: string;
  logo: string;
}

export const KEYBOARD_CHAR_CODE = {
  SPACE: 32
};

export const getDomain = (emailAddress: string) => {
  const atSign = emailAddress.indexOf("@");
  return emailAddress.substring(atSign + 1);
};
