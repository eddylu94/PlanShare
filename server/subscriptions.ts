interface ISubscriptionCategory {
  [key: string]: {
    name: string;
    subscriptionCategoryId: string;
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
  ONLINE_STREAMING: {
    subscriptionCategoryId: "ONLINE_STREAMING",
    name: "Streaming"
  },
  MOBILE_SERVICE: {
    subscriptionCategoryId: "MOBILE_SERVICE",
    name: "Mobile Plans"
  },
  MUSIC_SERVICE: {
    subscriptionCategoryId: "MUSIC_SERVICE",
    name: "Music"
  },
	REFERRALS: {
    subscriptionCategoryId: "REFERRALS",
    name: "Referrals"
  },
  INTERVIEW_PREP: {
    subscriptionCategoryId: "INTERVIEW_PREP",
    name: "Interview Prep"
  },
  DELIVERIES: {
    subscriptionCategoryId: "DELIVERIES",
    name: "Group Purchases"
  },
  OTHER: {
    subscriptionCategoryId: "OTHER",
    name: "Other"
  }
};

const subscriptionCategoriesIds = [
  SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
	SUBSCRIPTION_CATEGORY.INTERVIEW_PREP.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.DELIVERIES.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId
];

export const subscriptionCategories = subscriptionCategoriesIds.map(
  id => SUBSCRIPTION_CATEGORY[id]
);

export const SUBSCRIPTION: ISubscription = {
  NETFLIX_ONLINE_STREAMING: {
    subscriptionBrandId: "NETFLIX_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Netflix",
    logo: "https://planshare.io/plans/netflix_online_streaming.png"
  },
  PRIME_ONLINE_STREAMING: {
    subscriptionBrandId: "PRIME_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Prime Video",
    logo: "https://planshare.io/plans/prime_online_streaming.png"
  },
  HULU_ONLINE_STREAMING: {
    subscriptionBrandId: "HULU_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Hulu",
    logo: "https://planshare.io/plans/hulu_online_streaming.png"
  },
  DISNEY_ONLINE_STREAMING: {
    subscriptionBrandId: "DISNEY_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Disney Plus",
    logo: "https://planshare.io/plans/disney_online_streaming.png"
  },
  HOTSTAR_ONLINE_STREAMING: {
    subscriptionBrandId: "HOTSTAR_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Hotstar",
    logo: "https://planshare.io/plans/hotstar_online_streaming.png"
  },
  ESPN_ONLINE_STREAMING: {
    subscriptionBrandId: "ESPN_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "ESPN Plus",
    logo: "https://planshare.io/plans/espn_online_streaming.png"
  },
  YOUTUBE_TV: {
    subscriptionBrandId: "YOUTUBE_TV",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "YouTube TV",
    logo: "https://planshare.io/plans/youtube_tv.png"
  },
  HULU_TV: {
    subscriptionBrandId: "HULU_TV",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Hulu with Live TV",
    logo: "https://planshare.io/plans/hulu_tv.png"
  },
  ATT_TV: {
    subscriptionBrandId: "ATT_TV",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "AT&T TV Now",
    logo: "https://planshare.io/plans/att_tv.png"
  },
  VERIZON_MOBILE: {
    subscriptionBrandId: "VERIZON_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Verizon Wireless",
    logo: "https://planshare.io/plans/verizon_mobile.png"
  },
  SPRINT_MOBILE: {
    subscriptionBrandId: "SPRINT_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Sprint Wireless",
    logo: "https://planshare.io/plans/sprint_mobile.png"
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
  SPOTIFY_MUSIC: {
    subscriptionBrandId: "SPOTIFY_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Spotify",
    logo: "https://planshare.io/plans/spotify_music.png"
  },
  APPLE_MUSIC: {
    subscriptionBrandId: "APPLE_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Apple Music",
    logo: "https://planshare.io/plans/apple_music.png"
  },
  TIDAL_MUSIC: {
    subscriptionBrandId: "TIDAL_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Tidal",
    logo: "https://planshare.io/plans/tidal_music.png"
  },
  AMAZON_MUSIC: {
    subscriptionBrandId: "AMAZON_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Amazon Music",
    logo: "https://planshare.io/plans/amazon_music.png"
  },
  YOUTUBE_MUSIC: {
    subscriptionBrandId: "YOUTUBE_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "YouTube Music",
    logo: "https://planshare.io/plans/youtube_music.png"
  },
  PANDORA_MUSIC: {
    subscriptionBrandId: "PANDORA_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Pandora Music",
    logo: "https://planshare.io/plans/pandora_music.png"
  },
	CHASE_SAPPHIRE_RESERVE_REFERRAL: {
    subscriptionBrandId: "CHASE_SAPPHIRE_RESERVE_REFERRAL",
    type: SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
    name: "Chase Reserve Credit Card",
    logo: "https://planshare.io/plans/chase_sapphire_reserve_icon.png",
  },
	AMEX_PLATINUM_REFERRAL: {
		subscriptionBrandId: "AMEX_PLATINUM_REFERRAL",
    type: SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId,
    name: "Amex Platinum Credit Card",
    logo: "https://planshare.io/plans/amex_platinum_icon.png",
	},
  LEETCODE: {
    subscriptionBrandId: "LEETCODE",
    type: SUBSCRIPTION_CATEGORY.INTERVIEW_PREP.subscriptionCategoryId,
    name: "LeetCode",
    logo: "https://planshare.io/plans/leetcode.png"
  },
  GROCERIES: {
    subscriptionBrandId: "GROCERIES",
    type: SUBSCRIPTION_CATEGORY.DELIVERIES.subscriptionCategoryId,
    name: "Groceries",
    logo: "https://planshare.io/plans/groceries.png"
  },
  AUTONOMOUS_AI: {
    subscriptionBrandId: "AUTONOMOUS_AI",
    type: SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId,
    name: "Autonomous AI",
    logo: "https://planshare.io/plans/autonomous_ai.png"
  },
  NINTENDO_ONLINE: {
    subscriptionBrandId: "NINTENDO_ONLINE",
    type: SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId,
    name: "Nintendo Online",
    logo: "https://planshare.io/plans/nintendo_online.png"
  },
  TWENTY_FOUR_HOUR_FITNESS: {
    subscriptionBrandId: "TWENTY_FOUR_HOUR_FITNESS",
    type: SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId,
    name: "24 Hour Fitness",
    logo: "https://planshare.io/plans/twenty_hour_hour_fitness.png"
  },
  LA_FITNESS: {
    subscriptionBrandId: "LA_FITNESS",
    type: SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId,
    name: "LA Fitness",
    logo: "https://planshare.io/plans/la_fitness.png"
  },
  OTHER: {
    subscriptionBrandId: "OTHER",
    type: SUBSCRIPTION_CATEGORY.OTHER.subscriptionCategoryId,
    name: "Other",
    logo: "https://planshare.io/icon.png"
  }
};

const onlineStreamingBrandIds = [
  SUBSCRIPTION.NETFLIX_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.PRIME_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.HULU_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.DISNEY_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.HOTSTAR_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.ESPN_ONLINE_STREAMING.subscriptionBrandId,
	SUBSCRIPTION.YOUTUBE_TV.subscriptionBrandId,
  SUBSCRIPTION.HULU_TV.subscriptionBrandId,
  SUBSCRIPTION.ATT_TV.subscriptionBrandId,
  SUBSCRIPTION.OTHER.subscriptionBrandId
];

const mobileSubscriptionBrandIds = [
  SUBSCRIPTION.TMOBILE_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.VERIZON_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.SPRINT_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.ATT_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.METRO_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.CRICKET_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.OTHER.subscriptionBrandId
];

const musicSubscriptionBrandIds = [
  SUBSCRIPTION.SPOTIFY_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.APPLE_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.TIDAL_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.AMAZON_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.YOUTUBE_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.PANDORA_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.OTHER.subscriptionBrandId
];

const referralBrandIds = [
	SUBSCRIPTION.CHASE_SAPPHIRE_RESERVE_REFERRAL.subscriptionBrandId,
	SUBSCRIPTION.AMEX_PLATINUM_REFERRAL.subscriptionBrandId,
];

const interviewPrepBrandIds = [
  SUBSCRIPTION.LEETCODE.subscriptionBrandId,
  SUBSCRIPTION.OTHER.subscriptionBrandId
];

const deliveryBrandIds = [
  SUBSCRIPTION.GROCERIES.subscriptionBrandId,
  SUBSCRIPTION.OTHER.subscriptionBrandId
];

const otherBrandIds = [
  SUBSCRIPTION.AUTONOMOUS_AI.subscriptionBrandId,
  SUBSCRIPTION.NINTENDO_ONLINE.subscriptionBrandId,
  SUBSCRIPTION.TWENTY_FOUR_HOUR_FITNESS.subscriptionBrandId,
  SUBSCRIPTION.LA_FITNESS.subscriptionBrandId,
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
    case SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId:
      ids = musicSubscriptionBrandIds;
      break;
		case SUBSCRIPTION_CATEGORY.REFERRALS.subscriptionCategoryId:
			ids = referralBrandIds;
			break;
    case SUBSCRIPTION_CATEGORY.INTERVIEW_PREP.subscriptionCategoryId:
      ids = interviewPrepBrandIds;
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
