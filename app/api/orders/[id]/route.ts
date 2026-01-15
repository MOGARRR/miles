import { NextResponse, NextRequest } from "next/server";
import { deleteOrder, getOrderById, updateOrder } from "@/src/controllers/orderControllers";


//GET
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orders = await getOrderById(params.id);
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/orders error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const updatedOrderItem = await req.json();

    const result = await updateOrder(orderId, updatedOrderItem);

    return NextResponse.json({ orders: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

 // DELETE //CHANGE TO UPDATE CAUSE OF REFERENCE ERROR

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    const result = await deleteOrder(orderId);

    return NextResponse.json({ orders: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
