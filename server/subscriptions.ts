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
  LIVE_TV_STREAMING: {
    subscriptionCategoryId: "LIVE_TV_STREAMING",
    name: "Live TV Streaming"
  },
  MOBILE_SERVICE: {
    subscriptionCategoryId: "MOBILE_SERVICE",
    name: "Mobile Service"
  },
  MUSIC_SERVICE: {
    subscriptionCategoryId: "MUSIC_SERVICE",
    name: "Music Service"
  }
};

const tvSubscriptionCategoriesIds = [
  SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId
];

export const subscriptionCategories = tvSubscriptionCategoriesIds.map(id => {
  return {
    subscriptionCategoryId: id,
    ...SUBSCRIPTION_CATEGORY[id]
  };
});

export const SUBSCRIPTION: ISubscription = {
  YOUTUBE_TV: {
    subscriptionBrandId: "YOUTUBE_TV",
    type: SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.name,
    name: "YouTube TV",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/YouTube_TV_logo.svg/1280px-YouTube_TV_logo.svg.png"
  },
  SLING_TV: {
    subscriptionBrandId: "SLING_TV",
    type: SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.name,
    name: "Sling TV",
    logo: "https://news.sling.com/download/2019SlingLogo.png"
  },
  HULU_TV: {
    subscriptionBrandId: "HULU_TV",
    type: SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.name,
    name: "Hulu with Live TV",
    logo:
      "https://assetshuluimcom-a.akamaihd.net/h3o/facebook_share_thumb_default_hulu.jpg"
  },
  ATT_TV: {
    subscriptionBrandId: "ATT_TV",
    type: SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.name,
    name: "AT&T TV Now",
    logo: "https://www.att.com/idpassets/sales/uf/tv/att-tv-logo-420.jpg"
  },
  VERIZON_MOBILE: {
    subscriptionBrandId: "VERIZON_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.name,
    name: "Verizon Wireless",
    logo:
      "data:image/png;base64,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"
  },
  SPRINT_MOBILE: {
    subscriptionBrandId: "SPRINT_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.name,
    name: "Sprint Wireless",
    logo: "https://www.sprint.com/en/shop/cell-phones.thumb.319.319.png"
  },
  TMOBILE_MOBILE: {
    subscriptionBrandId: "TMOBILE_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.name,
    name: "T-Mobile",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/T-Mobile_logo.svg/1280px-T-Mobile_logo.svg.png"
  },
  ATT_MOBILE: {
    subscriptionBrandId: "ATT_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.name,
    name: "AT&T Wireless",
    logo: "https://about.att.com/ecms/dam/snrlogos/AT&T%20Logo.png"
  },
  METRO_MOBILE: {
    subscriptionBrandId: "METRO_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.name,
    name: "Metro",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/6/67/MetroByT-Mobile.png"
  },
  US_MOBILE_MOBILE: {
    subscriptionBrandId: "US_MOBILE_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.name,
    name: "US Mobile",
    logo: "https://www.usmobile.com/blog/wp-content/uploads/2016/03/US-Logo.jpg"
  },
  CRICKET_MOBILE: {
    subscriptionBrandId: "CRICKET_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.name,
    name: "Cricket",
    logo: "https://www.cricketwireless.com/uiassets/cricketwirelesslogo.jpg"
  },
  SPOTIFY_MUSIC: {
    subscriptionBrandId: "SPOTIFY_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.name,
    name: "Spotify",
    logo: "https://developer.spotify.com/assets/branding-guidelines/logo@2x.png"
  },
  APPLE_MUSIC: {
    subscriptionBrandId: "APPLE_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.name,
    name: "Apple Music",
    logo:
      "https://is2-ssl.mzstatic.com/image/thumb/Purple123/v4/e9/83/82/e9838282-357a-f013-bc68-26a17d729348/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-10.png/246x0w.png"
  },
  TIDAL_MUSIC: {
    subscriptionBrandId: "TIDAL_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.name,
    name: "Tidal",
    logo:
      "https://read.tidal.com/wp-content/themes/eddiemachado-bones-d1b3b54/library/images/tidal_mag.jpg"
  },
  AMAZON_MUSIC: {
    subscriptionBrandId: "AMAZON_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.name,
    name: "Amazon Music",
    logo:
      "data:image/png;base64,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"
  },
  YOUTUBE_MUSIC: {
    subscriptionBrandId: "YOUTUBE_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.name,
    name: "YouTube Music",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Youtube_Music_logo.svg/1200px-Youtube_Music_logo.svg.png"
  }
};

const tvSubscriptionBrandIds = [
  SUBSCRIPTION.YOUTUBE_TV.subscriptionBrandId,
  SUBSCRIPTION.SLING_TV.subscriptionBrandId,
  SUBSCRIPTION.HULU_TV.subscriptionBrandId,
  SUBSCRIPTION.ATT_TV.subscriptionBrandId
];

const mobileSubscriptionBrandIds = [
  SUBSCRIPTION.VERIZON_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.SPRINT_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.TMOBILE_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.ATT_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.METRO_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.US_MOBILE_MOBILE.subscriptionBrandId,
  SUBSCRIPTION.CRICKET_MOBILE.subscriptionBrandId
];

const musicSubscriptionBrandIds = [
  SUBSCRIPTION.SPOTIFY_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.APPLE_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.TIDAL_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.AMAZON_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.YOUTUBE_MUSIC.subscriptionBrandId
];

export const retrieveSubscriptionBrands = (type: string) => {
  let ids;
  switch (type) {
    case SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.subscriptionCategoryId:
      ids = tvSubscriptionBrandIds;
      break;
    case SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId:
      ids = mobileSubscriptionBrandIds;
      break;
    case SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId:
      ids = musicSubscriptionBrandIds;
      break;
    default:
      ids = tvSubscriptionBrandIds;
      break;
  }

  return ids.map(id => SUBSCRIPTION[id]);
};
