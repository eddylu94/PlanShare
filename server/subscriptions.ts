interface ISubscriptionGroup {
  [key: string]: string;
}
interface ISubscriptionType {
  [key: string]: string;
}

const LIVE_TV_STREAMING: ISubscriptionGroup = {
  YOUTUBE: "YouTube TV",
  SLING: "Sling TV",
  HULU: "Hulu with Live TV",
  ATT: "AT&T TV Now"
};

const MOBILE_SERVICE: ISubscriptionGroup = {
  VERIZON: "Verizon Wireless",
  SPRINT: "Sprint Wireless",
  TMOBILE: "T-Mobile",
  ATT: "AT&T Wireless",
  METRO: "Metro",
  US_MOBILE: "US Mobile",
  CRICKET: "Cricket"
};

const MUSIC_SERVICE: ISubscriptionGroup = {
  SPOTIFY: "Spotify",
  APPLE_MUSIC: "Apple Music",
  TIDAL: "Tidal",
  AMAZON: "Amazon Music",
  YOUTUBE: "YouTube Music"
};

export const SUBSCRIPTION_TYPE: ISubscriptionType = {
  LIVE_TV_STREAMING: "Live TV Streaming",
  MOBILE_SERVICE: "Mobile Service",
  MUSIC_SERVICE: "Music Service"
};

export const retrieveSubscriptionGroup = (type: string) => {
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
