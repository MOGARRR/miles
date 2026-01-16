import { NextResponse, NextRequest } from "next/server";
import { getOrderProductByOrderId } from "@/src/controllers/order_productsControllers";

//GET
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order_product = await getOrderProductByOrderId(params.id);
    return NextResponse.json({ order_product }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/order_product error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
