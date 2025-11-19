import { NextResponse, NextRequest } from "next/server";
import { deleteCategoriesProducts, getCategorieProductById, updateCategoriesProducts } from "@/src/controllers/categories_productsControllers";

//GET
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categories_products = await getCategorieProductById(params.id);
    return NextResponse.json({ categories_products }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/categories_products error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoriesProductsId = params.id;
    const updatedCategoriesProductsItem = await req.json();

    const result = await updateCategoriesProducts(categoriesProductsId, updatedCategoriesProductsItem);

    return NextResponse.json({ categories_products: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoriesProductsId = params.id;

    const result = await deleteCategoriesProducts(categoriesProductsId);

    return NextResponse.json({ categories_products: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );  
  }
}

