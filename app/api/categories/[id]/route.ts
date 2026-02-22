import { NextResponse, NextRequest } from "next/server";
import {
  deleteCategoriesProducts,
  getCategorieProductById,
  updateCategoriesProducts,
} from "@/src/controllers/categoriesControllers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

//GET
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const categories = await getCategorieProductById(id);
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/categories error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const categoriesProductsId = id;
    const updatedCategoriesProductsItem = await req.json();

    const result = await updateCategoriesProducts(
      categoriesProductsId,
      updatedCategoriesProductsItem,
    );

    return NextResponse.json({ categories: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 },
    );
  }
}
// DELETE
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const result = await deleteCategoriesProducts(id);

    return NextResponse.json({ categories: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 },
    );
  }
}
