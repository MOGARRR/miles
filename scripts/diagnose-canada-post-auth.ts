/**
 * Diagnose Canada Post OAuth + Rating API (new Developer Portal JSON API).
 * Run: npx tsx scripts/diagnose-canada-post-auth.ts
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { buildRatesRequestJson } from "../app/lib/canadaPost/buildRatesRequestJson";
import {
  DEFAULT_CANADA_POST_RATING_URL,
  DEFAULT_CANADA_POST_TOKEN_URL,
} from "../app/lib/canadaPost/constants";
import {
  getCanadaPostConfig,
  normalizeCustomerNumber,
  resetCanadaPostConfigCache,
} from "../app/lib/canadaPost/env";
import {
  getCanadaPostAccessToken,
  resetCanadaPostTokenCache,
} from "../app/lib/canadaPost/getOAuthToken";

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

async function main() {
  loadEnvFile();
  resetCanadaPostConfigCache();
  resetCanadaPostTokenCache();

  const customerNumber = normalizeCustomerNumber(
    process.env.CANADA_POST_CUSTOMER_NUMBER!.trim(),
  );

  const oauthScope = process.env.CANADA_POST_OAUTH_SCOPE?.trim();

  console.log("Canada Post Developer Portal API diagnostic");
  console.log(`Token URL: ${process.env.CANADA_POST_TOKEN_URL ?? DEFAULT_CANADA_POST_TOKEN_URL}`);
  console.log(`Rating URL: ${process.env.CANADA_POST_RATING_URL ?? DEFAULT_CANADA_POST_RATING_URL}`);
  console.log(`Customer number: ${customerNumber}`);
  console.log(`OAuth scope: ${oauthScope ?? "(not set — see CANADA_POST_OAUTH_SCOPE in .env)"}`);
  console.log("---");

  if (!oauthScope) {
    console.error("\nSet CANADA_POST_OAUTH_SCOPE in .env before running this diagnostic.");
    console.error("Find it in the Developer Portal:");
    console.error("  1. Catalog → Rating API → Scopes section (copy the scope name exactly)");
    console.error("  2. Apps → your app → Credentials → check scope selection for Rating API");
    process.exit(1);
  }

  try {
    const token = await getCanadaPostAccessToken();
    console.log("\n[OAuth2 token]");
    console.log(`  Success — bearer token received (${token.length} chars)`);

    const config = getCanadaPostConfig();
    const requestBody = buildRatesRequestJson({
      customerNumber: config.customerNumber,
      contractId: config.contractId,
      originPostalCode: "M4V2B7",
      destinationPostalCode: "K2B8J6",
      parcel: {
        weightKg: 0.454,
        lengthCm: 38.1,
        widthCm: 30.5,
        heightCm: 1.3,
        mailingTube: false,
      },
      serviceCodes: ["DOM.RP"],
    });

    const response = await fetch(config.ratingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const bodyText = await response.text();
    let bodyJson: unknown;
    try {
      bodyJson = JSON.parse(bodyText);
    } catch {
      bodyJson = bodyText;
    }

    console.log("\n[Rating POST /v1/prices — Small sleeve test parcel]");
    console.log(`  HTTP ${response.status}`);
    if (Array.isArray(bodyJson)) {
      console.log(`  Quote count: ${bodyJson.length}`);
      if (bodyJson.length > 0) {
        const first = bodyJson[0] as Record<string, unknown>;
        const due = (first.priceDetails as Record<string, unknown> | undefined)?.due;
        console.log(`  First quote: ${first.serviceCode} — $${due} CAD`);
      }
    } else if (typeof bodyJson === "object" && bodyJson !== null) {
      const record = bodyJson as Record<string, unknown>;
      const quotes = Array.isArray(record.priceQuotes)
        ? record.priceQuotes
        : Array.isArray(record.quotes)
          ? record.quotes
          : [];
      console.log(`  Quote count: ${quotes.length}`);
      if (quotes.length > 0) {
        console.log("  First quote:", quotes[0]);
      } else {
        console.log("  Response:", JSON.stringify(bodyJson, null, 2));
      }
    } else {
      console.log("  Response:", bodyText.slice(0, 500));
    }
  } catch (error) {
    console.error("\nDiagnostic FAILED:");
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
