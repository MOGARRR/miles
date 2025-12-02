import { NextResponse } from "next/server";
import {
  AddressCreateRequest,
  DistanceUnitEnum,
  ParcelCreateRequest,
  Shippo,
  WeightUnitEnum,
  LabelFileTypeEnum,
} from "shippo";

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

export async function POST(request: Request) {
  try {
    //MOCK CHANGE TO BODY BEFORE PRODUCTION
    const addressFrom: AddressCreateRequest = {
      name: "Test Sender",
      street1: "111 King St W",
      city: "Toronto",
      state: "ON",
      zip: "M5H 1A1",
      country: "CA",
    };
 //MOCK CHANGE TO BODY BEFORE PRODUCTION
    const addressTo: AddressCreateRequest = {
      name: "Test Recipient",
      street1: "222 Queen St W",
      city: "Toronto",
      state: "ON",
      zip: "M5H 2N2",
      country: "CA",
    };
 //MOCK CHANGE TO BODY BEFORE PRODUCTION
    const parcel: ParcelCreateRequest = {
      length: "10",
      width: "10",
      height: "10",
      distanceUnit: DistanceUnitEnum.In,
      weight: "2",
      massUnit: WeightUnitEnum.Lb,
    };

    // create shipment object
    const shipment = await shippo.shipments.create({
      addressFrom,
      addressTo,
      parcels: [parcel],
      async: false,
    });

    //MOCK CHANGE TO CANADA POST BEFORE PRODUCTION
    // loop through rates and find provider or default to the first one
    const rate = shipment.rates.find(r => r.provider === "UPS") || shipment.rates[0];

    if (!rate) {
      return NextResponse.json(
        { error: "No rates available for this shipment." },
        { status: 400 }
      );
    }

    // create transaction object
    const transaction = await shippo.transactions.create({
      rate: rate.objectId,
      labelFileType: LabelFileTypeEnum.Pdf,
      async: false,
      carrierAccount: rate.carrierAccount, 
    });


    return NextResponse.json({
      provider: rate.provider,
      shipmentId: shipment.objectId,
      transactionId: transaction.objectId,
      trackingNumber: transaction.trackingNumber,
      labelUrl: transaction.labelUrl,
      rateAmount: rate.amount,
      rateCurrency: rate.currency,
      serviceLevel: rate.servicelevel.name,
    });
  } catch (err: any) {
    console.error("Shippo error:", err?.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
