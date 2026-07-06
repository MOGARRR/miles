/**
 * Run with: npx tsx scripts/test-canada-post-rates.ts
 *
 * Sandbox smoke test: Toronto (M4V2B7) → Ottawa area (K2B8J6).
 * Does not touch the rates route or cart UI.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { SHIPPING_PARCEL_PROFILES } from "../src/config/shippingParcelProfiles";
import { inchesToCm, poundsToKg } from "../src/helpers/calculateDimWeight";
import { getRates } from "../app/lib/canadaPost/getRates";
import { getRatesForParcels } from "../app/lib/canadaPost/getRatesForParcels";
import type { ShippingParcel } from "../src/helpers/createParcels";
import { CANADA_POST_CHECKOUT_SERVICE_CODES } from "../app/lib/canadaPost/constants";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  const contents = readFileSync(envPath, "utf8");
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();
    process.env[key] = value;
  }
}

function buildParcelFromProfile(
  profileKey: keyof typeof SHIPPING_PARCEL_PROFILES,
): ShippingParcel {
  const profile = SHIPPING_PARCEL_PROFILES[profileKey];
  return {
    sizeLabel: profile.sizeLabel,
    lengthIn: profile.lengthIn,
    widthIn: profile.widthIn,
    heightIn: profile.heightIn,
    lengthCm: inchesToCm(profile.lengthIn),
    widthCm: inchesToCm(profile.widthIn),
    heightCm: inchesToCm(profile.heightIn),
    totalWeightLb: profile.totalWeightLb,
    weightKg: poundsToKg(profile.totalWeightLb),
    mailingTube: profile.mailingTube ?? false,
  };
}

async function main() {
  loadEnvFile();

  const originPostalCode = "M4V2B7";
  const destinationPostalCode = "K2B8J6";

  console.log("Canada Post sandbox Get Rates test");
  console.log(`Route: ${originPostalCode} → ${destinationPostalCode}`);
  console.log(`Services: ${CANADA_POST_CHECKOUT_SERVICE_CODES.join(", ")}`);
  console.log("---");

  const smallParcel = buildParcelFromProfile("Small");
  console.log("\n1) Single Small sleeve parcel");
  const smallResult = await getRates({
    originPostalCode,
    destinationPostalCode,
    parcel: {
      weightKg: smallParcel.weightKg,
      lengthCm: smallParcel.lengthCm,
      widthCm: smallParcel.widthCm,
      heightCm: smallParcel.heightCm,
      mailingTube: smallParcel.mailingTube,
    },
    serviceCodes: [...CANADA_POST_CHECKOUT_SERVICE_CODES],
  });
  console.table(
    smallResult.quotes.map((quote) => ({
      serviceCode: quote.serviceCode,
      serviceName: quote.serviceName,
      priceCad: quote.priceCad,
      expectedDeliveryDate: quote.expectedDeliveryDate ?? "",
    })),
  );

  const largeParcel = buildParcelFromProfile("Large");
  console.log("\n2) Single Large tube parcel (mailing-tube: true)");
  const largeResult = await getRates({
    originPostalCode,
    destinationPostalCode,
    parcel: {
      weightKg: largeParcel.weightKg,
      lengthCm: largeParcel.lengthCm,
      widthCm: largeParcel.widthCm,
      heightCm: largeParcel.heightCm,
      mailingTube: largeParcel.mailingTube,
    },
    serviceCodes: [...CANADA_POST_CHECKOUT_SERVICE_CODES],
  });
  console.table(
    largeResult.quotes.map((quote) => ({
      serviceCode: quote.serviceCode,
      serviceName: quote.serviceName,
      priceCad: quote.priceCad,
      expectedDeliveryDate: quote.expectedDeliveryDate ?? "",
    })),
  );

  console.log("\n3) Multi-parcel cart (1 Small + 1 Large) — summed, cheapest selected");
  const combined = await getRatesForParcels({
    originPostalCode,
    destinationPostalCode,
    parcels: [smallParcel, largeParcel],
  });
  console.log("All combined options:");
  console.table(
    combined.allOptions.map((quote) => ({
      serviceCode: quote.serviceCode,
      serviceName: quote.serviceName,
      priceCad: quote.priceCad,
      priceCents: quote.priceCents,
      expectedDeliveryDate: quote.expectedDeliveryDate ?? "",
    })),
  );
  console.log("Cheapest selected:");
  console.log(combined.selectedQuote);
  console.log("\nSandbox test completed successfully.");
}

main().catch((error) => {
  console.error("\nSandbox test FAILED:");
  console.error(error);
  process.exit(1);
});
