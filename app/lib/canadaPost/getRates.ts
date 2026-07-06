import { buildRatesRequestJson } from "./buildRatesRequestJson";
import {
  CanadaPostAuthError,
  CanadaPostInvalidAddressError,
  CanadaPostNoServicesError,
  CanadaPostUnavailableError,
} from "./errors";
import { getCanadaPostConfig, normalizeCanadianPostalCode } from "./env";
import { getCanadaPostAccessToken } from "./getOAuthToken";
import {
  parseRatesResponseJson,
  type ParsedRateQuote,
} from "./parseRatesResponseJson";
import type { RatesRequestParcel } from "./buildRatesRequestJson";

export type GetRatesInput = {
  originPostalCode: string;
  destinationPostalCode: string;
  parcel: RatesRequestParcel;
  serviceCodes: string[];
};

export type RateQuote = {
  serviceCode: string;
  serviceName: string;
  priceCad: number;
  expectedDeliveryDate?: string;
};

function mapParsedQuote(parsedQuote: ParsedRateQuote): RateQuote {
  return {
    serviceCode: parsedQuote.serviceCode,
    serviceName: parsedQuote.serviceName,
    priceCad: parsedQuote.priceCad,
    expectedDeliveryDate: parsedQuote.expectedDeliveryDate,
  };
}

function throwForHttpStatus(status: number, responseBody: unknown): never {
  const body = typeof responseBody === "object" && responseBody !== null
    ? (responseBody as Record<string, unknown>)
    : null;

  const message =
    (body && typeof body.message === "string" && body.message) ||
    (body && typeof body.error_description === "string" && body.error_description) ||
    (body && typeof body.error === "string" && body.error) ||
    null;

  if (status === 401 || status === 403) {
    throw new CanadaPostAuthError(
      message ?? "Canada Post authentication failed. Check API key and secret.",
    );
  }

  if (status === 400) {
    throw new CanadaPostNoServicesError(
      message ??
        "Canada Post rejected the rate request. Check parcel dimensions, weight, or postal codes.",
    );
  }

  if (status >= 500) {
    throw new CanadaPostUnavailableError(
      message ?? "Canada Post rating service is temporarily unavailable.",
    );
  }

  throw new CanadaPostUnavailableError(
    message ?? `Unexpected Canada Post response (HTTP ${status}).`,
  );
}

/**
 * Calls the Developer Portal Rating API for a single parcel.
 * 1. OAuth2 client_credentials token
 * 2. POST JSON to .../rating/v1/prices with Bearer token
 */
export async function getRates(input: GetRatesInput): Promise<{
  quotes: RateQuote[];
  rawJson: unknown;
}> {
  let originPostalCode: string;
  let destinationPostalCode: string;

  try {
    originPostalCode = normalizeCanadianPostalCode(input.originPostalCode);
    destinationPostalCode = normalizeCanadianPostalCode(
      input.destinationPostalCode,
    );
  } catch {
    throw new CanadaPostInvalidAddressError();
  }

  const config = getCanadaPostConfig();
  const requestBody = buildRatesRequestJson({
    customerNumber: config.customerNumber,
    contractId: config.contractId,
    originPostalCode,
    destinationPostalCode,
    parcel: input.parcel,
    serviceCodes: input.serviceCodes,
  });

  const accessToken = await getCanadaPostAccessToken();

  const response = await fetch(config.ratingUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  let responseJson: unknown;
  try {
    responseJson = JSON.parse(responseText);
  } catch {
    if (!response.ok) {
      throwForHttpStatus(response.status, responseText);
    }
    throw new CanadaPostUnavailableError("Canada Post returned a non-JSON response.");
  }

  if (!response.ok) {
    throwForHttpStatus(response.status, responseJson);
  }

  const parsed = parseRatesResponseJson(responseJson);
  return {
    quotes: parsed.quotes.map(mapParsedQuote),
    rawJson: parsed.rawJson,
  };
}
