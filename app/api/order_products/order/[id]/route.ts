import { NextResponse, NextRequest } from "next/server";
import { getOrderProductByOrderId } from "@/src/controllers/order_productsControllers";
import { getOrderById } from "@/src/controllers/orderControllers";

//GET Order data and its product data 
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id);
    try {
      const order_product = await getOrderProductByOrderId(params.id);
      return NextResponse.json({ order, order_product }, { status: 200 });
    } catch (error: any) {
      console.error("GET /api/order_product error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error("GET /api/order error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
