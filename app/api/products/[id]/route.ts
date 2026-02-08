import { NextResponse, NextRequest } from "next/server";
import {
  getProductById,
  updateProduct,
  updateProductWithCategories,
  deleteProduct,
} from "@/src/controllers/productControllers";

// GET
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedProductItem = await req.json();

    const result = await updateProductWithCategories(Number(id), updatedProductItem)

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
