
import { getProductSizeForProduct } from "@/src/controllers/product_sizesControllers";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "@/src/types/routeContext";


//GET
export async function GET(
  request: NextRequest, context: RouteContext
) {
  try {
    const { id } = await context.params;
    const product_sizes = await getProductSizeForProduct(Number(id));
    return NextResponse.json({ product_sizes }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/product-sizes error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


