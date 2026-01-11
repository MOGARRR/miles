import { NextResponse, NextRequest } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/src/controllers/productControllers";

// GET
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const product = await getProductById(id);

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/products/[id] error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const updatedProductItem = await req.json();

    const result = await updateProduct(id, updatedProductItem);

    return NextResponse.json({ product: result });
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const result = await deleteProduct(id);

    return NextResponse.json({ product: result });
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
