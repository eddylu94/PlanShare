interface ISubscriptionCategory {
  [key: string]: {
    name: string;
    subscriptionCategoryId: string;
		image: string;
  };
}

interface ISubscription {
  [key: string]: {
    type: string;
    name: string;
    logo: string;
    subscriptionBrandId: string;
  };
}

export const SUBSCRIPTION_CATEGORY: ISubscriptionCategory = {
	MOBILE_SERVICE: {
    subscriptionCategoryId: "MOBILE_SERVICE",
    name: "Mobile Plans",
		image: "https://planshare.io/mobile_icon.png",
  },
	ONLINE_STREAMING: {
    subscriptionCategoryId: "ONLINE_STREAMING",
    name: "Streaming",
		image: "https://planshare.io/online_streaming_icon.png",
  },
	REFERRALS: {
    subscriptionCategoryId: "REFERRALS",
    name: "Referral Codes",
		image: "https://planshare.io/referral_icon.png",
	},
  DELIVERIES: {
    subscriptionCategoryId: "DELIVERIES",
    name: "Group Purchases",
		image: "https://planshare.io/group_purchase_icon.png",
	},
  OTHER: {
    subscriptionCategoryId: "OTHER",
    name: "Other",
		image: "https://planshare.io/icon.png",
	}
};

const subscriptionCategoriesIds = [
  SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
	SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.DELIVERIES.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId,
];

export const subscriptionCategories = subscriptionCategoriesIds.map(
  id => SUBSCRIPTION_CATEGORY[id]
);

export const SUBSCRIPTION: ISubscription = {
  HULU_ONLINE_STREAMING: {
    subscriptionBrandId: "HULU_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Hulu",
    logo: "https://planshare.io/plans/hulu_online_streaming.png"
  },
  HOTSTAR_ONLINE_STREAMING: {
    subscriptionBrandId: "HOTSTAR_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Hotstar",
    logo: "https://planshare.io/plans/hotstar_online_streaming.png"
  },
	OTHER_ONLINE_STREAMING: {
    subscriptionBrandId: "OTHER_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Other",
    logo: "https://planshare.io/online_streaming_icon.png"
  },
  VERIZON_MOBILE: {
    subscriptionBrandId: "VERIZON_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Verizon Wireless",
    logo: "https://planshare.io/plans/verizon_mobile.png"
  },
  TMOBILE_MOBILE: {
    subscriptionBrandId: "TMOBILE_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "T-Mobile",
    logo: "https://planshare.io/plans/tmobile_mobile.png"
  },
  ATT_MOBILE: {
    subscriptionBrandId: "ATT_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "AT&T Wireless",
    logo: "https://planshare.io/plans/att_mobile.png"
  },
  METRO_MOBILE: {
    subscriptionBrandId: "METRO_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Metro",
    logo: "https://planshare.io/plans/metro_mobile.png"
  },
  CRICKET_MOBILE: {
    subscriptionBrandId: "CRICKET_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Cricket",
    logo: "https://planshare.io/plans/cricket_mobile.png"
  },
	OTHER_MOBILE: {
    subscriptionBrandId: "OTHER_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Other",
    logo: "https://planshare.io/mobile_icon.png"
  },
	CHASE_SAPPHIRE_RESERVE_REFERRAL: {
    subscriptionBrandId: "CHASE_SAPPHIRE_RESERVE_REFERRAL",
    type: SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
    name: "Chase Reserve Card Referral",
    logo: "https://planshare.io/plans/chase_sapphire_reserve_icon.png",
  },
	AMEX_PLATINUM_REFERRAL: {
		subscriptionBrandId: "AMEX_PLATINUM_REFERRAL",
    type: SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
    name: "Amex Platinum Card Referral",
    logo: "https://planshare.io/plans/amex_platinum_icon.png",
	},
	INSTACART_REFERRAL: {
		subscriptionBrandId: "INSTACART_REFERRAL",
    type: SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
    name: "Instacart Referral",
    logo: "https://planshare.io/plans/instacart_icon.png",
	},
	AUTONOMOUS_AI_REFERRAL: {
    subscriptionBrandId: "AUTONOMOUS_AI_REFERRAL",
    type: SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
    name: "Autonomous AI",
    logo: "https://planshare.io/plans/autonomous_ai.png"
  },
	OTHER_REFERRAL: {
    subscriptionBrandId: "OTHER_REFERRAL",
    type: SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
    name: "Other",
    logo: "https://planshare.io/referral_icon.png"
  },
  GROCERIES: {
    subscriptionBrandId: "GROCERIES",
    type: SUBSCRIPTION_CATEGORY.DELIVERIES.subscriptionCategoryId,
    name: "Groceries",
    logo: "https://planshare.io/plans/groceries.png"
  },
	OTHER_GROUP_PURCHASE: {
    subscriptionBrandId: "OTHER_GROUP_PURCHASE",
    type: SUBSCRIPTION_CATEGORY.DELIVERIES.subscriptionCategoryId,
    name: "Other",
    logo: "https://planshare.io/group_purchase_icon.png"
  },
  NINTENDO_ONLINE: {
    subscriptionBrandId: "NINTENDO_ONLINE",
    type: SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId,
    name: "Nintendo Online",
    logo: "https://planshare.io/plans/nintendo_online.png"
  },
  OTHER: {
    subscriptionBrandId: "OTHER",
    type: SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId,
    name: "Other",
    logo: "https://planshare.io/icon.png"
  }
};

const onlineStreamingBrandIds = [
  SUBSCRIPTION.HULU_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.HOTSTAR_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.OTHER_ONLINE_STREAMING.subscriptionBrandId
];

const mobileSubscriptionBrandIds = [
  SUBSCRIPTION.TMOBILE_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.VERIZON_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.ATT_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.METRO_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.CRICKET_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.OTHER_MOBILE.subscriptionBrandId
];

const referralBrandIds = [
	SUBSCRIPTION.CHASE_SAPPHIRE_RESERVE_REFERRAL.subscriptionBrandId,
	SUBSCRIPTION.AMEX_PLATINUM_REFERRAL.subscriptionBrandId,
	SUBSCRIPTION.INSTACART_REFERRAL.subscriptionBrandId,
	SUBSCRIPTION.AUTONOMOUS_AI_REFERRAL.subscriptionBrandId,
	SUBSCRIPTION.OTHER_REFERRAL.subscriptionBrandId
];

const deliveryBrandIds = [
  SUBSCRIPTION.GROCERIES.subscriptionBrandId,
  SUBSCRIPTION.OTHER_GROUP_PURCHASE.subscriptionBrandId
];

const otherBrandIds = [
  SUBSCRIPTION.OTHER.subscriptionBrandId
];

export const retrieveSubscriptionBrands = (type: string) => {
  let ids;
  switch (type) {
    case SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId:
      ids = onlineStreamingBrandIds;
      break;
    case SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId:
      ids = mobileSubscriptionBrandIds;
      break;
		case SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId:
			ids = referralBrandIds;
			break;
    case SUBSCRIPTION_CATEGORY.DELIVERIES.subscriptionCategoryId:
      ids = deliveryBrandIds;
      break;
    case SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId:
      ids = otherBrandIds;
      break;
    default:
      ids = onlineStreamingBrandIds;
      break;
  }

  return ids.map(id => SUBSCRIPTION[id]);
};
