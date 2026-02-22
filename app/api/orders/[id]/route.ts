import { NextResponse, NextRequest } from "next/server";
import { deleteOrder, getOrderById, updateOrder } from "@/src/controllers/orderControllers";
import { RouteContext } from "@/src/types/routeContext";

//GET
export async function GET(
  request: NextRequest, context: RouteContext
) {
  try {
    const { id } = await context.params;
    const orders = await getOrderById(id);
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/orders error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// PUT
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const {id}= await context.params;
    const updatedOrderItem = await req.json();

    const result = await updateOrder(id, updatedOrderItem);

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

export async function DELETE(request: NextRequest, context: RouteContext
) {
  try {
    const {id} = await context.params;

    const result = await deleteOrder(id);

    return NextResponse.json({ orders: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
