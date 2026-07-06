import { CanadaPostNoServicesError } from "./errors";

export type ParsedRateQuote = {
  serviceCode: string;
  serviceName: string;
  priceCad: number;
  expectedDeliveryDate?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function readNumber(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function extractDuePrice(quote: Record<string, unknown>): number | null {
  const priceDetails = asRecord(quote.priceDetails);
  if (priceDetails) {
    const due = readNumber(priceDetails, "due");
    if (due !== null) return due;
  }

  const due = readNumber(quote, "due");
  if (due !== null) return due;

  const price = readNumber(quote, "price");
  if (price !== null) return price;

  return null;
}

function extractExpectedDeliveryDate(quote: Record<string, unknown>): string | undefined {
  const serviceStandard = asRecord(quote.serviceStandard);
  if (serviceStandard) {
    const date = readString(serviceStandard, "expectedDeliveryDate");
    if (date) return date;
  }

  const date = readString(quote, "expectedDeliveryDate");
  return date ?? undefined;
}

function extractQuotesArray(responseJson: unknown): unknown[] {
  if (Array.isArray(responseJson)) return responseJson;

  const response = asRecord(responseJson);
  if (!response) return [];

  if (Array.isArray(response.priceQuotes)) return response.priceQuotes;
  if (Array.isArray(response.quotes)) return response.quotes;
  if (Array.isArray(response.data)) return response.data;
  return [];
}

/**
 * Parses the Developer Portal Rating API JSON response into quote objects.
 * The live API returns a top-level array of quote objects (per Rating-3_0_0.yaml).
 */
export function parseRatesResponseJson(responseJson: unknown): {
  quotes: ParsedRateQuote[];
  rawJson: unknown;
} {
  const quoteItems = extractQuotesArray(responseJson);

  const response = asRecord(responseJson);
  if (!response && !Array.isArray(responseJson)) {
    throw new CanadaPostNoServicesError("Canada Post returned an invalid JSON response.");
  }

  if (response) {
    const errorMessage =
      readString(response, "message") ||
      readString(response, "error_description") ||
      readString(response, "error");
    if (errorMessage && quoteItems.length === 0) {
      const code = readString(response, "code") ?? undefined;
      throw new CanadaPostNoServicesError(errorMessage, code ?? undefined);
    }
  }
  const quotes: ParsedRateQuote[] = [];

  for (const item of quoteItems) {
    const quote = asRecord(item);
    if (!quote) continue;

    const serviceCode = readString(quote, "serviceCode");
    const serviceName = readString(quote, "serviceName") ?? serviceCode;
    const priceCad = extractDuePrice(quote);

    if (!serviceCode || serviceName === null || priceCad === null) {
      continue;
    }

    quotes.push({
      serviceCode,
      serviceName,
      priceCad,
      expectedDeliveryDate: extractExpectedDeliveryDate(quote),
    });
  }

  if (quotes.length === 0) {
    throw new CanadaPostNoServicesError(
      "No shipping rates were returned for this parcel and destination.",
    );
  }

  return { quotes, rawJson: responseJson };
}
