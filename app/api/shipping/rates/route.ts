import { NextResponse } from "next/server";
import {
  CanadaPostAuthError,
  CanadaPostInvalidAddressError,
  CanadaPostNoServicesError,
  CanadaPostUnavailableError,
} from "@/app/lib/canadaPost/errors";
import { normalizeCanadianPostalCode } from "@/app/lib/canadaPost/env";
import { getRatesForParcels } from "@/app/lib/canadaPost/getRatesForParcels";
import {
  FREE_SHIPPING_RATE,
  isFreeShippingEnabled,
} from "@/app/lib/shipping/freeShipping";
import { logShippingQuote } from "@/src/controllers/shippingQuoteControllers";
import createParcels, {
  type CartParcelItem,
} from "@/src/helpers/createParcels";

export const dynamic = "force-dynamic";

type RatesRequestBody = {
  addressTo?: { zip?: string };
  cart?: Array<{
    sizeLabel: string;
    quantity: number;
  }>;
};

function shippingUnavailableResponse(message: string, status = 503) {
  return NextResponse.json(
    {
      error: message,
      code: "SHIPPING_UNAVAILABLE",
    },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RatesRequestBody;
    const { addressTo, cart } = body;

    if (!addressTo?.zip || !cart?.length) {
      return NextResponse.json(
        { error: "Missing required fields: addressTo.zip and cart." },
        { status: 400 },
      );
    }

    if (isFreeShippingEnabled()) {
      return NextResponse.json({
        rate: FREE_SHIPPING_RATE,
        quotes: [],
      });
    }

    const destinationPostalCode = normalizeCanadianPostalCode(addressTo.zip);
    const cartItems: CartParcelItem[] = cart.map((item) => ({
      sizeLabel: item.sizeLabel,
      quantity: item.quantity,
    }));
    const parcels = await createParcels(cartItems);

    const quoteResult = await getRatesForParcels({
      destinationPostalCode,
      parcels,
    });

    const { selectedQuote, allOptions, perParcelRawResponses } = quoteResult;

    void logShippingQuote({
      destinationPostal: destinationPostalCode,
      parcelCount: parcels.length,
      parcelsJson: parcels,
      rawResponseJson: {
        allOptions,
        perParcelRawResponses,
      },
      selectedServiceCode: selectedQuote.serviceCode,
      totalCents: selectedQuote.priceCents,
    });

    return NextResponse.json({
      rate: {
        amountCents: selectedQuote.priceCents,
        serviceCode: selectedQuote.serviceCode,
        serviceName: selectedQuote.serviceName,
        expectedDeliveryDate: selectedQuote.expectedDeliveryDate,
      },
      quotes: allOptions,
    });
  } catch (error) {
    if (error instanceof CanadaPostInvalidAddressError) {
      return NextResponse.json(
        { error: error.message, code: "INVALID_ADDRESS" },
        { status: 400 },
      );
    }

    if (error instanceof CanadaPostNoServicesError) {
      return shippingUnavailableResponse(
        "No shipping services are available for this address and parcel size. Please check your postal code and try again.",
        400,
      );
    }

    if (error instanceof CanadaPostAuthError) {
      console.error("[shipping] Canada Post auth error:", error.message);
      return shippingUnavailableResponse(
        "Shipping is temporarily unavailable. Please try again later.",
      );
    }

    if (error instanceof CanadaPostUnavailableError) {
      console.error("[shipping] Canada Post unavailable:", error.message);
      return shippingUnavailableResponse(
        "Shipping is temporarily unavailable. Please try again later.",
      );
    }

    console.error("[shipping] unexpected rates error:", error);
    return shippingUnavailableResponse(
      "Shipping is temporarily unavailable. Please try again later.",
    );
  }
}
