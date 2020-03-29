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
  ONLINE_STREAMING: {
    subscriptionCategoryId: "ONLINE_STREAMING",
    name: "Online Streaming"
  },
  MOBILE_SERVICE: {
    subscriptionCategoryId: "MOBILE_SERVICE",
    name: "Mobile"
  },
  MUSIC_SERVICE: {
    subscriptionCategoryId: "MUSIC_SERVICE",
    name: "Music"
  },
  GYM_MEMBERSHIPS: {
    subscriptionCategoryId: "GYM_MEMBERSHIPS",
    name: "Gym Memberships"
  }
};

const tvSubscriptionCategoriesIds = [
  SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
  SUBSCRIPTION_CATEGORY.GYM_MEMBERSHIPS.subscriptionCategoryId
];

export const subscriptionCategories = tvSubscriptionCategoriesIds.map(
  id => SUBSCRIPTION_CATEGORY[id]
);

export const SUBSCRIPTION: ISubscription = {
  NETFLIX_ONLINE_STREAMING: {
    subscriptionBrandId: "NETFLIX_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Netflix",
    logo:
      "https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1474467529/zlaaxu2whczitkpkxxk9.jpg"
  },
  PRIME_ONLINE_STREAMING: {
    subscriptionBrandId: "PRIME_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Prime Video",
    logo:
      "https://static-s.aa-cdn.net/img/ios/545519333/e5f660c03b5b101636f5d5e74a7a1656?v=1"
  },
  HULU_ONLINE_STREAMING: {
    subscriptionBrandId: "HULU_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Hulu",
    logo:
      "https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/bk8cux6dapq8qjzylfaj"
  },
  DISNEY_ONLINE_STREAMING: {
    subscriptionBrandId: "DISNEY_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "Disney Plus",
    logo:
      "https://b.thumbs.redditmedia.com/i0u_V1MX8xCS5MGbTkjafMi1MyY_WSvWHkx2XTSf3hY.png"
  },
  ESPN_ONLINE_STREAMING: {
    subscriptionBrandId: "ESPN_ONLINE_STREAMING",
    type: SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId,
    name: "ESPN Plus",
    logo:
      "https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1460573872/gjea3w1kxocgn0qviykf.png"
  },
  YOUTUBE_TV: {
    subscriptionBrandId: "YOUTUBE_TV",
    type: SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.subscriptionCategoryId,
    name: "YouTube TV",
    logo: "https://miro.medium.com/fit/c/256/256/0*nxGz8OFtprDXvGjI.jpg"
  },
  SLING_TV: {
    subscriptionBrandId: "SLING_TV",
    type: SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.subscriptionCategoryId,
    name: "Sling TV",
    logo:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/aa/5c/41/aa5c41e2-e131-abfa-c3f6-9649b426a561/source/256x256bb.jpg"
  },
  HULU_TV: {
    subscriptionBrandId: "HULU_TV",
    type: SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.subscriptionCategoryId,
    name: "Hulu with Live TV",
    logo:
      "https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/bk8cux6dapq8qjzylfaj"
  },
  ATT_TV: {
    subscriptionBrandId: "ATT_TV",
    type: SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.subscriptionCategoryId,
    name: "AT&T TV Now",
    logo:
      "https://is2-ssl.mzstatic.com/image/thumb/Purple114/v4/46/72/b6/4672b669-9258-bd66-ec13-c4e665f59feb/source/256x256bb.jpg"
  },
  VERIZON_MOBILE: {
    subscriptionBrandId: "VERIZON_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Verizon Wireless",
    logo:
      "https://rm-core-production.s3.amazonaws.com/logos/1538/large_Verizon_Wireless.png"
  },
  SPRINT_MOBILE: {
    subscriptionBrandId: "SPRINT_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Sprint Wireless",
    logo:
      "data:image/png;base64,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"
  },
  TMOBILE_MOBILE: {
    subscriptionBrandId: "TMOBILE_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "T-Mobile",
    logo:
      "https://rm-core-production.s3.amazonaws.com/logos/646/large_T-Mobile-Recruit-Military-Logo.png"
  },
  ATT_MOBILE: {
    subscriptionBrandId: "ATT_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "AT&T Wireless",
    logo:
      "https://d3g9pb5nvr3u7.cloudfront.net/sites/59fa3c07920c1046f1d06561/-1589708846/256.jpg"
  },
  METRO_MOBILE: {
    subscriptionBrandId: "METRO_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Metro",
    logo:
      "https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/qxxtkroxlp3nyzwheet4"
  },
  CRICKET_MOBILE: {
    subscriptionBrandId: "CRICKET_MOBILE",
    type: SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId,
    name: "Cricket",
    logo:
      "https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1412840385/sl0tggfrhompma1be1hf.jpg"
  },
  SPOTIFY_MUSIC: {
    subscriptionBrandId: "SPOTIFY_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Spotify",
    logo:
      "https://developer.spotify.com/assets/branding-guidelines/icon4@2x.png"
  },
  APPLE_MUSIC: {
    subscriptionBrandId: "APPLE_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Apple Music",
    logo:
      "https://bloximages.newyork1.vip.townnews.com/insideradio.com/content/tncms/assets/v3/editorial/f/3b/f3b684de-1211-11e6-aa53-0fba9174a6a6/572a1dc58b594.image.jpg"
  },
  TIDAL_MUSIC: {
    subscriptionBrandId: "TIDAL_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Tidal",
    logo:
      "https://i.pinimg.com/originals/03/87/94/0387941ddfa7f9631478b712f4423aff.png"
  },
  AMAZON_MUSIC: {
    subscriptionBrandId: "AMAZON_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "Amazon Music",
    logo:
      "https://static.macupdate.com/products/49585/l/amazon-music-logo.webp?v=1581950120"
  },
  YOUTUBE_MUSIC: {
    subscriptionBrandId: "YOUTUBE_MUSIC",
    type: SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId,
    name: "YouTube Music",
    logo:
      "https://lh3.googleusercontent.com/proxy/zs2U3TnbJA8DnAQpMC7JWdGklD67aGaz3CtEp4xEWxxwQjpnKjQGEccko5n43SEaN-JuHIvErZO04R49l9uk-TbBCxQLrD2I5Dk9Ga2c-aeWDoumMra76PvDAe8c6d6nR9ck292nkw"
  },
  TWENTY_FOUR_HOUR_FITNESS: {
    subscriptionBrandId: "TWENTY_FOUR_HOUR_FITNESS",
    type: SUBSCRIPTION_CATEGORY.GYM_MEMBERSHIPS.subscriptionCategoryId,
    name: "24 Hour Fitness",
    logo:
      "https://s11284.pcdn.co/wp-content/uploads/2015/06/24-hour-fitness-logo.jpg"
  },
  LA_FITNESS: {
    subscriptionBrandId: "LA_FITNESS",
    type: SUBSCRIPTION_CATEGORY.GYM_MEMBERSHIPS.subscriptionCategoryId,
    name: "LA Fitness",
    logo:
      "https://www.mallmaverick.com/system/stores/store_fronts/000/045/815/original/LA_Fitness.png?1549387921"
  }
};

const onlineStreamingBrandIds = [
  SUBSCRIPTION.NETFLIX_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.PRIME_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.HULU_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.DISNEY_ONLINE_STREAMING.subscriptionBrandId,
  SUBSCRIPTION.ESPN_ONLINE_STREAMING.subscriptionBrandId
];

const liveTvSubscriptionBrandIds = [
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
  SUBSCRIPTION.CRICKET_MOBILE.subscriptionBrandId
];

const musicSubscriptionBrandIds = [
  SUBSCRIPTION.SPOTIFY_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.APPLE_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.TIDAL_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.AMAZON_MUSIC.subscriptionBrandId,
  SUBSCRIPTION.YOUTUBE_MUSIC.subscriptionBrandId
];

const gymMembershipBrandIds = [
  SUBSCRIPTION.TWENTY_FOUR_HOUR_FITNESS.subscriptionBrandId,
  SUBSCRIPTION.LA_FITNESS.subscriptionBrandId
];

export const retrieveSubscriptionBrands = (type: string) => {
  let ids;
  switch (type) {
    case SUBSCRIPTION_CATEGORY.ONLINE_STREAMING.subscriptionCategoryId:
      ids = onlineStreamingBrandIds;
      break;
    case SUBSCRIPTION_CATEGORY.LIVE_TV_STREAMING.subscriptionCategoryId:
      ids = liveTvSubscriptionBrandIds;
      break;
    case SUBSCRIPTION_CATEGORY.MOBILE_SERVICE.subscriptionCategoryId:
      ids = mobileSubscriptionBrandIds;
      break;
    case SUBSCRIPTION_CATEGORY.MUSIC_SERVICE.subscriptionCategoryId:
      ids = musicSubscriptionBrandIds;
      break;
    case SUBSCRIPTION_CATEGORY.GYM_MEMBERSHIPS.subscriptionCategoryId:
      ids = gymMembershipBrandIds;
      break;
    default:
      ids = onlineStreamingBrandIds;
      break;
  }

  return ids.map(id => SUBSCRIPTION[id]);
};
