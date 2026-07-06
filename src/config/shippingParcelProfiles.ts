export type ParcelSizeLabel = "Small" | "Large";

/**
 * Shipping dimensions and weight for one packed parcel of a given print size.
 * We weigh the fully packed parcel as one unit (not print + packaging separately).
 */
export type ParcelProfile = {
  sizeLabel: ParcelSizeLabel;
  /** Longest outer dimension in inches. */
  lengthIn: number;
  /** Second-longest outer dimension in inches. */
  widthIn: number;
  /** Shortest outer dimension in inches. */
  heightIn: number;
  /** Total shipped weight in pounds (prints + mailer/tube + padding). */
  totalWeightLb: number;
  /** How many prints fit in one parcel of this profile. */
  printsPerParcel: number;
  /**
   * True for cylindrical mailing tubes (Large prints).
   * Part 2 will send this to Canada Post so the $2 tube surcharge is included in quotes.
   */
  mailingTube?: boolean;
};

export const SHIPPING_PARCEL_PROFILES: Record<ParcelSizeLabel, ParcelProfile> = {
  Small: {
    sizeLabel: "Small",
    lengthIn: 15,
    widthIn: 12,
    heightIn: 0.5,
    totalWeightLb: 1,
    printsPerParcel: 6,
  },
  Large: {
    sizeLabel: "Large",
    // Tube bounding box: length × diameter × diameter (Canada Post cubes tubes this way).
    lengthIn: 30,
    widthIn: 4,
    heightIn: 4,
    totalWeightLb: 2,
    printsPerParcel: 1,
    mailingTube: true,
  },
};

/**
 * Original hardcoded Shippo values kept only for before/after comparison in logs.
 * Large was incorrectly modeled as a flat box (30×26×4), not a tube.
 */
export const LEGACY_HARDCODED_PARCELS: Record<
  ParcelSizeLabel,
  {
    lengthIn: number;
    widthIn: number;
    heightIn: number;
    totalWeightLb: number;
    mailingTube?: boolean;
  }
> = {
  Small: { lengthIn: 15, widthIn: 12, heightIn: 1, totalWeightLb: 1 },
  Large: {
    lengthIn: 30,
    widthIn: 26,
    heightIn: 4,
    totalWeightLb: 2,
    mailingTube: false,
  },
};
