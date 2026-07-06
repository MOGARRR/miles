import {
  LEGACY_HARDCODED_PARCELS,
  SHIPPING_PARCEL_PROFILES,
  type ParcelProfile,
} from "@/src/config/shippingParcelProfiles";
import {
  auditParcelWeight,
  inchesToCm,
  poundsToKg,
  type ParcelWeightAudit,
} from "@/src/helpers/calculateDimWeight";

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

/**
 * Logs a before/after comparison so we can verify parcel config changes
 * against the old hardcoded Shippo values and see dimensional weight impact.
 */
function logParcelWeightComparison(currentAudit: ParcelWeightAudit): void {
  const legacyProfile =
    LEGACY_HARDCODED_PARCELS[
      currentAudit.sizeLabel as keyof typeof LEGACY_HARDCODED_PARCELS
    ];

  const legacyAudit = auditParcelWeight({
    sizeLabel: currentAudit.sizeLabel,
    lengthIn: legacyProfile.lengthIn,
    widthIn: legacyProfile.widthIn,
    heightIn: legacyProfile.heightIn,
    totalWeightLb: legacyProfile.totalWeightLb,
    mailingTube: legacyProfile.mailingTube,
  });

  console.info("[shipping] parcel weight audit", {
    sizeLabel: currentAudit.sizeLabel,
    before: legacyAudit,
    after: currentAudit,
  });
}

const createParcels = async (
  cart: CartParcelItem[],
): Promise<ShippingParcel[]> => {
  let smallPrintCount = 0;
  const parcels: ShippingParcel[] = [];
  const loggedSizeLabels = new Set<string>();

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

  for (const parcel of parcels) {
    if (loggedSizeLabels.has(parcel.sizeLabel)) {
      continue;
    }
    loggedSizeLabels.add(parcel.sizeLabel);
    logParcelWeightComparison(auditParcelWeight(parcel));
  }

  return parcels;
};

export default createParcels;
