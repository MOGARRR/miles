import { NextResponse } from "next/server";
import { Shippo, AddressCreateRequest } from "shippo";

// REMOVE WITH LIVE KEY
const validation = {
  validation_results: {
    is_valid: true,
    messages: [
      {
        source: "USPS",
        code: "Address Not Found",
        type: "address_error",
        text: "The address as submitted could not be found. Please check for excessive abbreviations in the street address line or in the City name.",
      },
    ],
  },
};

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { addressTo } = body;

    if (!addressTo) {
      return NextResponse.json(
        { error: "Missing required fields: addressTo." },
        { status: 400 },
      );
    }

    // const validation = await shippo.addresses.create({
    //   ...addressTo,
    //   validate: true,
    // });

    // REPLACE WITH VALIDATION WITH LIVE KEY
    return NextResponse.json({
      isValid: validation.validation_results.is_valid,
      messages: validation.validation_results.messages,
    });
  } catch (err: any) {
    console.error("Shippo validation error:", JSON.stringify(err, null, 2));
    return NextResponse.json(
      { error: err?.message ?? "Shippo validation failed" },
      { status: 500 },
    );
  }
}
