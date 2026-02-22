import { NextResponse, NextRequest } from "next/server";
import {
  deleteOrderProduct,
  getOrderProductById,
  updateOrderProducts,
} from "@/src/controllers/order_productsControllers";
import { RouteContext } from "@/src/types/routeContext";

//GET
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const order_product = await getOrderProductById(id);
    return NextResponse.json({ order_product }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/order_product error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: NextRequest, context: RouteContext
) {
  try {
    const {id} = await context.params;
    const updatedOrderProductItem = await req.json();

    const result = await updateOrderProducts(
      id,
      updatedOrderProductItem,
    );

    return NextResponse.json({ order_product: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 },
    );
  }
}

// DELETE
export async function DELETE(
  request: NextRequest, context: RouteContext,
) {
  try {
    const {id} = await context.params;

    const result = await deleteOrderProduct(id);

    return NextResponse.json({ order_product: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 },
    );
  }
}
