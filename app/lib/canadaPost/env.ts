/**
 * Canada Post Developer Portal configuration.
 *
 * The modern Rating API uses OAuth2 client_credentials (Key + Secret) and JSON —
 * not the legacy XML SOA gateway (ct.soa-gw.canadapost.ca).
 */

import {
  DEFAULT_CANADA_POST_RATING_URL,
  DEFAULT_CANADA_POST_TOKEN_URL,
} from "./constants";

export type CanadaPostEnv = {
  clientId: string;
  clientSecret: string;
  /** OAuth2 scope from the Developer Portal (Rating API → Scopes, or app credential settings). */
  oauthScope: string;
  customerNumber: string;
  contractId: string | null;
  tokenUrl: string;
  ratingUrl: string;
  originPostalCode: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Canada Post rating cannot run without it.`,
    );
  }
  return value;
}

function getOriginPostalCode(): string {
  const rawPostal = requireEnv("SHIP_FROM_ZIP");
  return normalizeCanadianPostalCode(rawPostal);
}

export function normalizeCanadianPostalCode(postalCode: string): string {
  const normalized = postalCode.replace(/\s+/g, "").toUpperCase();
  const isValid = /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalized);
  if (!isValid) {
    throw new Error(`Invalid Canadian postal code: ${postalCode}`);
  }
  return normalized;
}

/**
 * Canada Post customer numbers are numeric (up to 10 digits). The business portal
 * often shows a zero-padded value (e.g. 0001285126) while the Rating API expects
 * the core digits (e.g. 1285126).
 */
export function normalizeCustomerNumber(customerNumber: string): string {
  const digitsOnly = customerNumber.replace(/\D/g, "");
  if (!digitsOnly) {
    throw new Error(`Invalid Canada Post customer number: ${customerNumber}`);
  }
  const withoutLeadingZeros = digitsOnly.replace(/^0+/, "");
  return withoutLeadingZeros || "0";
}

function getCustomerNumber(): string {
  return normalizeCustomerNumber(requireEnv("CANADA_POST_CUSTOMER_NUMBER"));
}

function getContractId(): string | null {
  const contractId = process.env.CANADA_POST_CONTRACT_ID?.trim();
  return contractId || null;
}

function getOAuthCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.CANADA_POST_API_PRODUCTION_KEY?.trim();
  const clientSecret = process.env.CANADA_POST_API_PRODUCTION_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing Canada Post production OAuth credentials. Set CANADA_POST_API_PRODUCTION_KEY " +
        "and CANADA_POST_API_PRODUCTION_SECRET in .env (Developer Portal → production Key + Secret).",
    );
  }

  return { clientId, clientSecret };
}

function getOAuthScope(): string {
  const scope = process.env.CANADA_POST_OAUTH_SCOPE?.trim();
  if (!scope) {
    throw new Error(
      "Missing required environment variable: CANADA_POST_OAUTH_SCOPE. " +
        "Find the exact scope string in the Developer Portal: open the Rating API product page " +
        "and check the Scopes section, or edit your app credentials and note which scope(s) are " +
        "selected for the Rating API subscription. Copy the scope value exactly — do not guess.",
    );
  }
  return scope;
}

let cachedConfig: CanadaPostEnv | null = null;

export function getCanadaPostConfig(): CanadaPostEnv {
  if (cachedConfig) {
    return cachedConfig;
  }

  const { clientId, clientSecret } = getOAuthCredentials();

  cachedConfig = {
    clientId,
    clientSecret,
    oauthScope: getOAuthScope(),
    customerNumber: getCustomerNumber(),
    contractId: getContractId(),
    tokenUrl:
      process.env.CANADA_POST_TOKEN_URL?.trim() || DEFAULT_CANADA_POST_TOKEN_URL,
    ratingUrl:
      process.env.CANADA_POST_RATING_URL?.trim() ||
      DEFAULT_CANADA_POST_RATING_URL,
    originPostalCode: getOriginPostalCode(),
  };

  return cachedConfig;
}

/** Clears cached config (useful for tests that change env vars at runtime). */
export function resetCanadaPostConfigCache(): void {
  cachedConfig = null;
}
