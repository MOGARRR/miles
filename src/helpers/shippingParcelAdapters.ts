import { DistanceUnitEnum, ParcelCreateRequest, WeightUnitEnum } from "shippo";
import type { ShippingParcel } from "./createParcels";

/**
 * Converts our ShippingParcel to the shape the legacy Shippo rates route expects.
 * Part 2 will remove this adapter when we switch to Canada Post Get Rates.
 */
export function toShippoParcelRequest(
  parcel: ShippingParcel,
): ParcelCreateRequest {
  return {
    length: String(parcel.lengthIn),
    width: String(parcel.widthIn),
    height: String(parcel.heightIn),
    weight: String(parcel.totalWeightLb),
    distanceUnit: DistanceUnitEnum.In,
    massUnit: WeightUnitEnum.Lb,
  };
}
