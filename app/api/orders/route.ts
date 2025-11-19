import { NextResponse, NextRequest } from 'next/server'
import { getAllOrders, createOrder } from '@/src/controllers/orderControllers';


//GET
export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/orders error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//POST
export async function POST(req: Request) {
  try {
    const orderItem = await req.json();
    const order = await createOrder(orderItem);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/order error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}