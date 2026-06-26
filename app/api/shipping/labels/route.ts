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

    const { addressTo, parcel: parcels, orderInfo} = body;

    if (!addressTo || !parcels || !orderInfo) {
      return NextResponse.json(
        { error: "Missing required fields: addressTo, parcel, orderInfo." },
        { status: 400 }
      );
    }
    // Format parcel object correctly
       const parcelRequests: ParcelCreateRequest[] = parcels.map((item: any) => ({
      length: item.length,
      width: item.width,
      height: item.height,
      distanceUnit: item.distanceUnit || DistanceUnitEnum.In,
      weight: item.weight,
      massUnit: item.massUnit || WeightUnitEnum.Lb,
    }));


    //  Create shipment object
    const shipment = await shippo.shipments.create({
      addressFrom: ADDRESS_FROM,
      addressTo: addressTo as AddressCreateRequest,
      parcels: parcelRequests,
      async: false,
    });

    // default to the first one for baseline
    let rate = shipment.rates[0];

    // loop through shipments rates and get the lowest rate 
    for (let i = 0; i < shipment.rates.length; i++){
      if( shipment.rates[i].amount < rate.amount){
        rate = shipment.rates[i];
      }
    }
    
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

    const orderRecord = {
      status: transaction.status,
      shippingFeeCents: rate.amount,
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
