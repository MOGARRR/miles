import { NextResponse, NextRequest } from "next/server";
import { createOrderProduct, getAllOrderProducts } from "@/src/controllers/order_productsControllers";

//GET
export async function GET() {
  try {
    const orders_product = await getAllOrderProducts();
    return NextResponse.json({ orders: orders_product }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/orders_products error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//POST
export async function POST(req: Request) {
  try {
    const order_productItem = await req.json();
    const order_product = await createOrderProduct(order_productItem);
    return NextResponse.json({ order_product }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders_products error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}