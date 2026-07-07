import type { ShippingParcel } from "@/src/helpers/createParcels";
import {
  CANADA_POST_CHECKOUT_SERVICE_CODES,
  type CanadaPostCheckoutServiceCode,
} from "./constants";
import { getCanadaPostConfig } from "./env";
import { getRates, type RateQuote } from "./getRates";

export type CombinedRateQuote = RateQuote & {
  priceCents: number;
};

export type CheapestCombinedQuoteResult = {
  selectedQuote: CombinedRateQuote;
  allOptions: CombinedRateQuote[];
  perParcelRawResponses: { parcelIndex: number; rawJson: unknown }[];
};

function cadToCents(priceCad: number): number {
  return Math.round(priceCad * 100);
}

/**
 * Canada Post rates one parcel per API call. For multi-parcel carts we call
 * once per parcel and sum the price for each service code.
 */
export async function getRatesForParcels(input: {
  destinationPostalCode: string;
  parcels: ShippingParcel[];
  originPostalCode?: string;
}): Promise<CheapestCombinedQuoteResult> {
  if (input.parcels.length === 0) {
    throw new Error("At least one parcel is required to get shipping rates.");
  }

  const originPostalCode =
    input.originPostalCode ?? getCanadaPostConfig().originPostalCode;

  const serviceCodes = [...CANADA_POST_CHECKOUT_SERVICE_CODES];
  const totalsByService = new Map<
    CanadaPostCheckoutServiceCode,
    CombinedRateQuote
  >();
  const perParcelRawResponses: { parcelIndex: number; rawJson: unknown }[] = [];

  const parcelResults = await Promise.all(
    input.parcels.map((parcel, parcelIndex) =>
      getRates({
        originPostalCode,
        destinationPostalCode: input.destinationPostalCode,
        parcel: {
          weightKg: parcel.weightKg,
          lengthCm: parcel.lengthCm,
          widthCm: parcel.widthCm,
          heightCm: parcel.heightCm,
          mailingTube: parcel.mailingTube,
        },
        serviceCodes,
      }).then((result) => ({ parcelIndex, ...result })),
    ),
  );

  for (const { parcelIndex, quotes, rawJson } of parcelResults) {
    perParcelRawResponses.push({ parcelIndex, rawJson });

    for (const quote of quotes) {
      const serviceCode = quote.serviceCode as CanadaPostCheckoutServiceCode;
      if (!CANADA_POST_CHECKOUT_SERVICE_CODES.includes(serviceCode)) {
        continue;
      }

      const existingTotal = totalsByService.get(serviceCode);
      if (!existingTotal) {
        totalsByService.set(serviceCode, {
          ...quote,
          priceCents: cadToCents(quote.priceCad),
        });
        continue;
      }

      const combinedPriceCad = existingTotal.priceCad + quote.priceCad;
      totalsByService.set(serviceCode, {
        serviceCode,
        serviceName: existingTotal.serviceName,
        priceCad: combinedPriceCad,
        priceCents: cadToCents(combinedPriceCad),
        expectedDeliveryDate: pickLaterDeliveryDate(
          existingTotal.expectedDeliveryDate,
          quote.expectedDeliveryDate,
        ),
      });
    }
  }

  const allOptions = Array.from(totalsByService.values());
  if (allOptions.length === 0) {
    throw new Error("No Canada Post rates available for the selected services.");
  }

  const selectedQuote = allOptions.reduce((cheapest, current) =>
    current.priceCents < cheapest.priceCents ? current : cheapest,
  );

  return {
    selectedQuote,
    allOptions: allOptions.sort((a, b) => a.priceCents - b.priceCents),
    perParcelRawResponses,
  };
}

function pickLaterDeliveryDate(
  dateA?: string,
  dateB?: string,
): string | undefined {
  if (!dateA) return dateB;
  if (!dateB) return dateA;
  return dateA > dateB ? dateA : dateB;
}
