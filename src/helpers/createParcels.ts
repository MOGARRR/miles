import {
  SHIPPING_PARCEL_PROFILES,
  type ParcelProfile,
} from "@/src/config/shippingParcelProfiles";
import { inchesToCm, poundsToKg } from "@/src/helpers/calculateDimWeight";

export type CartParcelItem = {
  sizeLabel: string;
  quantity: number;
};

export type ShippingParcel = {
  sizeLabel: "Small" | "Large";
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  totalWeightLb: number;
  weightKg: number;
  mailingTube: boolean;
};

function buildShippingParcel(profile: ParcelProfile): ShippingParcel {
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

const createParcels = async (
  cart: CartParcelItem[],
): Promise<ShippingParcel[]> => {
  let smallPrintCount = 0;
  const parcels: ShippingParcel[] = [];

  for (const item of cart) {
    if (item.sizeLabel === "Large") {
      const largeProfile = SHIPPING_PARCEL_PROFILES.Large;
      for (let i = 0; i < item.quantity; i++) {
        parcels.push(buildShippingParcel(largeProfile));
      }
    }

    if (item.sizeLabel === "Small") {
      smallPrintCount += item.quantity;
    }
  }

  const sleevesNeeded = Math.ceil(smallPrintCount / 6);
  const smallProfile = SHIPPING_PARCEL_PROFILES.Small;

  for (let i = 0; i < sleevesNeeded; i++) {
    parcels.push(buildShippingParcel(smallProfile));
  }

  return parcels;
};

export default createParcels;
