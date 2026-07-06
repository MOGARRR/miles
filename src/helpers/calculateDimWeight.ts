/**
 * Canada Post dimensional (volumetric) weight helpers.
 *
 * Canada Post does not use a separate formula for tubes. They measure the
 * smallest rectangular box that can contain the item (length × width × height),
 * then divide volume by a service-specific divisor to get the "volumetric
 * equivalent" weight in kg.
 *
 * @see https://www.canadapost-postescanada.ca/cpc/en/support/articles/abcs-of-mailing/how-to-cube-an-item-and-calculate-the-ve-of-its-actual-weight.page
 */

/** Divisor for Regular Parcel (DOM.RP) — larger divisor = lower VE. */
export const CP_DIM_DIVISOR_REGULAR_PARCEL = 6000;

/** Divisor for Expedited Parcel and Xpresspost (DOM.EP, DOM.XP). */
export const CP_DIM_DIVISOR_EXPEDITED_AND_XPRESSPOST = 5000;

const POUNDS_TO_KG = 0.45359237;
const INCHES_TO_CM = 2.54;

export function poundsToKg(pounds: number): number {
  return pounds * POUNDS_TO_KG;
}

export function inchesToCm(inches: number): number {
  return inches * INCHES_TO_CM;
}

/**
 * Volumetric equivalent weight in kg.
 * Formula: (lengthCm × widthCm × heightCm) / divisor
 */
export function calculateDimensionalWeightKg(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  divisor: number,
): number {
  const volumeCubicCm = lengthCm * widthCm * heightCm;
  return volumeCubicCm / divisor;
}

/**
 * Billable weight for Canada Post: the greater of actual weight and
 * dimensional weight. When that value exceeds 0.75 kg, round up to the
 * nearest 0.5 kg increment.
 */
export function billableWeightKg(
  actualWeightKg: number,
  dimensionalWeightKg: number,
): number {
  const greaterWeightKg = Math.max(actualWeightKg, dimensionalWeightKg);

  if (greaterWeightKg <= 0.75) {
    return greaterWeightKg;
  }

  return Math.ceil(greaterWeightKg / 0.5) * 0.5;
}

export type ParcelWeightAudit = {
  sizeLabel: string;
  dimensionsIn: { length: number; width: number; height: number };
  dimensionsCm: { length: number; width: number; height: number };
  actualWeightLb: number;
  actualWeightKg: number;
  dimensionalWeightKgRegularParcel: number;
  dimensionalWeightKgExpedited: number;
  dimensionalWeightKgXpresspost: number;
  billableKgRegularParcel: number;
  billableKgExpedited: number;
  billableKgXpresspost: number;
  mailingTube: boolean;
};

/** Build a full weight audit for one parcel profile (used in logs). */
export function auditParcelWeight(profile: {
  sizeLabel: string;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  totalWeightLb: number;
  mailingTube?: boolean;
}): ParcelWeightAudit {
  const lengthCm = inchesToCm(profile.lengthIn);
  const widthCm = inchesToCm(profile.widthIn);
  const heightCm = inchesToCm(profile.heightIn);
  const actualWeightKg = poundsToKg(profile.totalWeightLb);

  const dimensionalWeightKgRegularParcel = calculateDimensionalWeightKg(
    lengthCm,
    widthCm,
    heightCm,
    CP_DIM_DIVISOR_REGULAR_PARCEL,
  );

  const dimensionalWeightKgExpedited = calculateDimensionalWeightKg(
    lengthCm,
    widthCm,
    heightCm,
    CP_DIM_DIVISOR_EXPEDITED_AND_XPRESSPOST,
  );

  // Expedited and Xpresspost share the same divisor (5000).
  const dimensionalWeightKgXpresspost = dimensionalWeightKgExpedited;

  return {
    sizeLabel: profile.sizeLabel,
    dimensionsIn: {
      length: profile.lengthIn,
      width: profile.widthIn,
      height: profile.heightIn,
    },
    dimensionsCm: {
      length: roundTo3Decimals(lengthCm),
      width: roundTo3Decimals(widthCm),
      height: roundTo3Decimals(heightCm),
    },
    actualWeightLb: profile.totalWeightLb,
    actualWeightKg: roundTo3Decimals(actualWeightKg),
    dimensionalWeightKgRegularParcel: roundTo3Decimals(
      dimensionalWeightKgRegularParcel,
    ),
    dimensionalWeightKgExpedited: roundTo3Decimals(
      dimensionalWeightKgExpedited,
    ),
    dimensionalWeightKgXpresspost: roundTo3Decimals(
      dimensionalWeightKgXpresspost,
    ),
    billableKgRegularParcel: billableWeightKg(
      actualWeightKg,
      dimensionalWeightKgRegularParcel,
    ),
    billableKgExpedited: billableWeightKg(
      actualWeightKg,
      dimensionalWeightKgExpedited,
    ),
    billableKgXpresspost: billableWeightKg(
      actualWeightKg,
      dimensionalWeightKgXpresspost,
    ),
    mailingTube: profile.mailingTube ?? false,
  };
}

function roundTo3Decimals(value: number): number {
  return Math.round(value * 1000) / 1000;
}
