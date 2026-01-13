import {
  AddressCreateRequest,
  DistanceUnitEnum,
  ParcelCreateRequest,
  Shippo,
  WeightUnitEnum,
  LabelFileTypeEnum,
} from "shippo";

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

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

export async function createShippingLabel({
  addressTo,
  parcel,
}: {
  addressTo: AddressCreateRequest;
  parcel: ParcelCreateRequest;
}) {
  
  if (!addressTo || !parcel) {
  throw new Error("addressTo and parcel are required");
}
  const parcelRequest = {
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
    addressTo: addressTo ,
    parcels: [parcelRequest],
    async: false,
  });

/// REMOVE BEFORE PRODUCTION
console.log("Shipment status:", shipment.status);
console.log("Shipment messages:", shipment.messages);

  // loop through rates and find provider or default to the first one
  const rate =
    shipment.rates.find((r) => r.provider === "UPS") || shipment.rates[0];

  if (!rate) throw new Error("No rates available for this shipment.");

  // Create transaction object
  const transaction = await shippo.transactions.create({
    rate: rate.objectId,
    labelFileType: LabelFileTypeEnum.Pdf,
    async: false,
    carrierAccount: rate.carrierAccount,
  });

  if (transaction.status !== "SUCCESS") {
    throw new Error("Shipping label creation failed");
  }

  return {
    status: transaction.status,
    shoppingFeeCents: rate.amount,
    trackingNumber: transaction.trackingNumber,
    labelUrl: transaction.labelUrl,
    estimatedDelivery: transaction.eta,
    shippingStatus: shipment.status,
  };
}
