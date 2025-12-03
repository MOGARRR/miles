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
    const body = await request.json();

    const { addressFrom, addressTo, parcel } = body;

    if (!addressFrom || !addressTo || !parcel) {
      return NextResponse.json(
        { error: "Missing required fields: addressFrom, addressTo, parcel." },
        { status: 400 }
      );
    }
    // Format parcel object correctly
    const parcelRequest: ParcelCreateRequest = {
      length: parcel.length,
      width: parcel.width,
      height: parcel.height,
      distanceUnit: parcel.distanceUnit || DistanceUnitEnum.In,
      weight: parcel.weight,
      massUnit: parcel.massUnit || WeightUnitEnum.Lb,
    };

    //  Create shipment object 
    const shipment = await shippo.shipments.create({
      addressFrom: addressFrom as AddressCreateRequest,
      addressTo: addressTo as AddressCreateRequest,
      parcels: [parcelRequest],
      async: false,
    });

    // loop through rates and find provider or default to the first one
    const rate =
      shipment.rates.find((r) => r.provider === "UPS") || shipment.rates[0];

    if (!rate) {
      return NextResponse.json(
        { error: "No rates available for this shipment." },
        { status: 400 }
      );
    }

    // Create transaction object
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




