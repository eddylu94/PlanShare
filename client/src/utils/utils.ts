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
  listingTitle: string;
  listingDescription: string;
  numberOfPeople: number;
  price: number;
  userId: string;
  username: string;
  createdDate: string;
  subscriptionUrl?: string;
  otherSubscription?: string;
  contactFb?: string;
  contactEmail?: string;
}

export interface IMessageData {
  userId: string;
  date: Date;
  message: string;
  username: string;
}

export interface IConversationData {
  conversationId: string;
  username: string;
  userId: string;
  messages: IMessageData[];
}

export interface IConversationSummary {
  conversationId: string;
  username: string;
  userId: string;
  lastMessage: IMessageData;
}

export const KEYBOARD_CHAR_CODE = {
  SPACE: 32
};

export const log = (value: any, params?: any) => {
  if (process.env.NODE_ENV === "development") {
    if (params) {
      console.log(value, params);
    } else {
      console.log(value);
    }
  }
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
      } else if (differenceInDays <= 7) {
        return `${differenceInDays} days ago`;
      } else {
        return "Over a week ago";
      }
    }
  }
};

export const isValidURL = (str: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

export const validatePass = (pass1: string) => {
  // Minimum eight characters, at least one letter and one number
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;
  return re.test(pass1);
};

export const SETTINGS_EMAIL_NOTIFICATIONS = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  NEVER: "NEVER"
};
