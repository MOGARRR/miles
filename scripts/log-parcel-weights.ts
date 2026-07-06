/**
 * Run with: npx tsx scripts/log-parcel-weights.ts
 * Exercises createParcels with a mixed cart and prints the weight audit logs.
 */
import createParcels from "../src/helpers/createParcels";

async function main() {
  const sampleCart = [
    { sizeLabel: "Small", quantity: 3 },
    { sizeLabel: "Large", quantity: 1 },
  ];

  console.log("Building parcels for sample cart:", sampleCart);
  console.log("---");

  const parcels = await createParcels(sampleCart);

  console.log("---");
  console.log(`Built ${parcels.length} parcel(s):`);
  for (const [index, parcel] of parcels.entries()) {
    console.log(`  [${index + 1}]`, parcel);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
