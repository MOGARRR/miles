/** Domestic parcel services we quote at checkout (cheapest of these is shown). */
export const CANADA_POST_CHECKOUT_SERVICE_CODES = [
  "DOM.RP",
  "DOM.EP",
  "DOM.XP",
] as const;

export type CanadaPostCheckoutServiceCode =
  (typeof CANADA_POST_CHECKOUT_SERVICE_CODES)[number];

/** New Developer Portal Rating API (JSON). */
export const DEFAULT_CANADA_POST_TOKEN_URL =
  "https://api.canadapost-postescanada.ca/prod/devportal-portaildesdeveloppeurs/cpc-api-native-oauth-provider/oauth2/token";

export const DEFAULT_CANADA_POST_RATING_URL =
  "https://api.canadapost-postescanada.ca/prod/devportal-portaildesdeveloppeurs/rating/v1/prices";
