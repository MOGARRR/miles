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

// Form with store owner info
const ADDRESS_FROM: AddressCreateRequest = {
  name: process.env.SHIP_FROM_NAME!,
  company: process.env.SHIP_FROM_COMPANY!,
  street1: process.env.SHIP_FROM_STREET1!,
  street2: process.env.SHIP_FROM_STREET2 || "",
  city: process.env.SHIP_FROM_CITY!,
  state: process.env.SHIP_FROM_STATE!,
  zip: process.env.SHIP_FROM_ZIP!,
  country: "CA",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { addressTo, parcel, orderInfo} = body;

    if (!addressTo || !parcel || !orderInfo) {
      return NextResponse.json(
        { error: "Missing required fields: addressTo, parcel, orderInfo." },
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
      addressFrom: ADDRESS_FROM,
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

    /// CHANGE MOCK DATA BEFORE PRODUCTION ///
    const orderRecord = {
      status: transaction.status,
      shoppingFeeCents: rate.amount,
      trackingNumber: transaction.trackingNumber,
      labelUrl: transaction.labelUrl,
      estimatedDelivery: transaction.eta,
      shippingStatus: shipment.status,
    };


    return NextResponse.json({
      orderRecord,
    });
  } catch (err: any) {
    console.error("Shippo error:", err?.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
