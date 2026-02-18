import { NextRequest, NextResponse } from "next/server";
import { getProductSizesStock } from "@/src/controllers/inventoryControllers";

/**
 * POST /api/stock
 *
 * Fetch latest stock values for multiple product sizes.
 *
 * Used by:
 * - Cart page load
 * - Pre-checkout validation
 * 
 * IMPORTANT:
 * - This route is READ-ONLY
 * - It does NOT modify inventory
 * - Inventory mutations happen only after successful payment (Stripe webhook)
 */

export async function POST(req: NextRequest) {
  try {

    // Parse JSON body from request
    const body = await req.json() ; 
    const { sizeIds } = body; 

    //basic validation 
    if(!Array.isArray(sizeIds) || sizeIds.length === 0) {
      return NextResponse.json(
        { error: "sizeIds must be a non-empty array" },
        { status: 400 }
      );
    }

    //Fetch latest stock values from the database
    const stockData = await getProductSizesStock(sizeIds);

    return NextResponse.json({
      stock: stockData,
    });
  } catch (err: any) {
    console.error("Stock sync failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch stock" },
      { status: 500 }
    );
  }
}
