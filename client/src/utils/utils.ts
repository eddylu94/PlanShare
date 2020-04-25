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

export interface IOrganization {
  domains: string[];
  name: string;
  logo: string;
}

export interface IProfileOrganizationData {
  email: string;
  organization: IOrganization;
}

export interface IFiltersOrganization {
  organizationId: string;
  name: string;
  isSelected: boolean;
}

export interface IFiltersSubscriptionCategory {
  subscriptionCategoryId: string;
  name: string;
  isSelected: boolean;
}

export interface ISubscription {
  name: string;
  type: string;
  logo: string;
}

export interface ISubscriptionData {
  _id: string;
  subscriptionTypeSelection: string;
  subscriptionBrand: ISubscription;
  listingContact: string;
  listingDescription: string;
  numberOfPeople: number;
  price: number;
  userId: string;
  firstName: string;
  organization: IOrganization;
  createdDate: string;
  subscriptionUrl?: string;
}

export interface IMessageData {
  userId: string;
  date: Date;
  message: string;
  firstName: string;
}

export interface IConversationData {
  conversationId: string;
  firstName: string;
  messages: IMessageData[];
}

export interface IConversationSummary {
  conversationId: string;
  firstName: string;
  lastMessage: IMessageData;
}

export const KEYBOARD_CHAR_CODE = {
  SPACE: 32
};

export const getDomain = (emailAddress: string) => {
  const atSign = emailAddress.indexOf("@");
  return emailAddress.substring(atSign + 1);
};

export const getDaysAgoString = (d: Date) => {
  const differenceInMilliseconds = new Date().getTime() - d.getTime();

  const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);

  if (differenceInMinutes === 0) {
    return "Just posted";
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min ago`;
  } else {
    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInHours === 1) {
      return "1 hour ago";
    } else if (differenceInHours < 24) {
      return `${differenceInHours} hours ago`;
    } else {
      const differenceInDays = Math.floor(differenceInHours / 24);

      if (differenceInDays === 1) {
        return "1 day ago";
      } else {
        return `${differenceInDays} days ago`;
      }
    }
  }
};
