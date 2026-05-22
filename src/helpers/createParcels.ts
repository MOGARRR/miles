import { DistanceUnitEnum, ParcelCreateRequest, WeightUnitEnum } from "shippo";

const smallPrint = {
  length: "15",
  width: "12",
  height: "0.5",
  weight: "1",
  distanceUnit: DistanceUnitEnum.In,
  massUnit: WeightUnitEnum.Lb,
};

const largePrint = {
  length: "30",
  width: "26",
  height: "4",
  weight: "2",
  distanceUnit: DistanceUnitEnum.In,
  massUnit: WeightUnitEnum.Lb,
};

const createParcels = async (cart: any) => {
   
  let sleeveAmount = 0;
  
  const parcels: ParcelCreateRequest[] = [];

  // Each large print is packed individually
  for (const item of cart) {
    if (item.product_size.label === "Large") {
      for (let i = 0; i < item.quantity; i++) {
        parcels.push(largePrint);
      }
    }
    
  // Small prints can be packed into sleeves in groups of 6
    if (item.product_size.label === "Small") {
      sleeveAmount += item.quantity;
    }
  }

  const sleevesNeeded = Math.floor(sleeveAmount / 6);

  for (let i = 0; i < sleevesNeeded; i++) {
    parcels.push(smallPrint);
  }

  return parcels;
};

export default createParcels;
