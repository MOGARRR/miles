import { NextResponse, NextRequest } from "next/server";
import { getOrderProductByOrderId } from "@/src/controllers/order_productsControllers";
import { getOrderById } from "@/src/controllers/orderControllers";
import { RouteContext } from "@/src/types/routeContext";

//GET Order data and its product data 
export async function GET(request: NextRequest, context: RouteContext){
  try {
    const { id } = await context.params;
    const order = await getOrderById(id);
    try {
      const order_product = await getOrderProductByOrderId(id);
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
