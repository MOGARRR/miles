export type RatesRequestParcel = {
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  mailingTube: boolean;
};

export type BuildRatesRequestJsonInput = {
  customerNumber: string;
  contractId: string | null;
  originPostalCode: string;
  destinationPostalCode: string;
  parcel: RatesRequestParcel;
  serviceCodes: string[];
};

function roundWeightKg(weightKg: number): number {
  return Math.round(weightKg * 1000) / 1000;
}

function roundDimensionCm(dimensionCm: number): number {
  return Math.round(dimensionCm * 10) / 10;
}

/**
 * Builds the JSON body for the Developer Portal Rating API (POST .../rating/v1/prices).
 * Weight is in kg; dimensions are in cm.
 */
export function buildRatesRequestJson(input: BuildRatesRequestJsonInput): object {
  const requestBody: Record<string, unknown> = {
    customerNumber: input.customerNumber,
    parcelCharacteristics: {
      weight: roundWeightKg(input.parcel.weightKg),
      dimensions: {
        length: roundDimensionCm(input.parcel.lengthCm),
        width: roundDimensionCm(input.parcel.widthCm),
        height: roundDimensionCm(input.parcel.heightCm),
      },
      mailingTube: input.parcel.mailingTube,
    },
    services: input.serviceCodes,
    originPostalCode: input.originPostalCode,
    destination: {
      domestic: {
        postalCode: input.destinationPostalCode,
      },
    },
  };

  if (input.contractId) {
    requestBody.contractId = input.contractId;
  }

  return requestBody;
}
