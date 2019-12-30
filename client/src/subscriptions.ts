export const LIVE_TV_STREAMING: { [key: string]: string } = {
  YOUTUBE: "YouTube TV",
  SLING: "Sling TV",
  HULU: "Hulu with Live TV",
  ATT: "AT&T TV Now"
};

export const MOBILE_SERVICE: { [key: string]: string } = {
  VERIZON: "Verizon Wireless",
  SPRINT: "Sprint Wireless",
  TMOBILE: "T-Mobile",
  ATT: "AT&T Wireless",
  METRO: "Metro",
  US_MOBILE: "US Mobile",
  CRICKET: "Cricket"
};

export const MUSIC_SERVICE: { [key: string]: string } = {
  SPOTIFY: "Spotify",
  APPLE_MUSIC: "Apple Music",
  TIDAL: "Tidal",
  AMAZON: "Amazon Music",
  YOUTUBE: "YouTube Music"
};

export const SUBSCRIPTION_TYPE: { [key: string]: string } = {
  LIVE_TV_STREAMING: "Live TV Streaming",
  MOBILE_SERVICE: "Mobile Service",
  MUSIC_SERVICE: "Music Service"
};

export const getSubscriptionGroup = (type: string) => {
  switch (type) {
    case SUBSCRIPTION_TYPE.LIVE_TV_STREAMING:
      return LIVE_TV_STREAMING;
    case SUBSCRIPTION_TYPE.MOBILE_SERVICE:
      return MOBILE_SERVICE;
    case SUBSCRIPTION_TYPE.MUSIC_SERVICE:
      return MUSIC_SERVICE;
    default:
      return LIVE_TV_STREAMING;
  }
};
