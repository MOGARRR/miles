/**
 * Compare Canada Post quotes for different parcel inputs.
 * Run: npx tsx scripts/compare-parcel-rates.ts
 */
import { readFileSync } from "fs";
import { buildRatesRequestJson } from "../app/lib/canadaPost/buildRatesRequestJson";
import { getCanadaPostConfig } from "../app/lib/canadaPost/env";
import { getCanadaPostAccessToken } from "../app/lib/canadaPost/getOAuthToken";
import { parseRatesResponseJson } from "../app/lib/canadaPost/parseRatesResponseJson";
import { SHIPPING_PARCEL_PROFILES } from "../src/config/shippingParcelProfiles";
import { inchesToCm, poundsToKg } from "../src/helpers/calculateDimWeight";

function loadEnvFile() {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;
    process.env[trimmed.slice(0, equalsIndex).trim()] = trimmed
      .slice(equalsIndex + 1)
      .trim();
  }
}

async function quoteParcel(
  label: string,
  profile: {
    lengthIn: number;
    widthIn: number;
    heightIn: number;
    totalWeightLb: number;
    mailingTube?: boolean;
  },
  extraBody: Record<string, unknown> = {},
) {
  const config = getCanadaPostConfig();
  const parcel = {
    weightKg: poundsToKg(profile.totalWeightLb),
    lengthCm: inchesToCm(profile.lengthIn),
    widthCm: inchesToCm(profile.widthIn),
    heightCm: inchesToCm(profile.heightIn),
    mailingTube: profile.mailingTube ?? false,
  };

  const body = {
    ...buildRatesRequestJson({
      customerNumber: config.customerNumber,
      contractId: config.contractId,
      originPostalCode: "M4V2B7",
      destinationPostalCode: "K2B8J6",
      parcel,
      serviceCodes: ["DOM.RP", "DOM.EP", "DOM.XP"],
    }),
    ...extraBody,
  };

  const token = await getCanadaPostAccessToken();
  const response = await fetch(config.ratingUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const rawJson = await response.json();
  const parsed = parseRatesResponseJson(rawJson);

  console.log(`\n=== ${label} ===`);
  console.log("parcel:", body.parcelCharacteristics);
  if (extraBody.quoteType) console.log("quoteType:", extraBody.quoteType);
  console.log(
    "quotes:",
    parsed.quotes.map((q) => `${q.serviceCode} $${q.priceCad}`).join(", ") ||
      "(none)",
  );

  const first = Array.isArray(rawJson) ? rawJson[0] : rawJson;
  if (first && typeof first === "object") {
    console.log("weightDetails:", (first as Record<string, unknown>).weightDetails);
    console.log("due:", (first as Record<string, unknown>).priceDetails);
  }
}

async function main() {
  loadEnvFile();

  await quoteParcel("Small sleeve", SHIPPING_PARCEL_PROFILES.Small);
  await quoteParcel("Large tube", SHIPPING_PARCEL_PROFILES.Large);
  await quoteParcel("Heavy (10 lb flat)", {
    ...SHIPPING_PARCEL_PROFILES.Small,
    totalWeightLb: 10,
  });
  await quoteParcel("Small + quoteType commercial", SHIPPING_PARCEL_PROFILES.Small, {
    quoteType: "commercial",
  });
  await quoteParcel("Small + quoteType counter", SHIPPING_PARCEL_PROFILES.Small, {
    quoteType: "counter",
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
