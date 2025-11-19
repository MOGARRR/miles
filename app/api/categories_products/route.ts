import { NextResponse, NextRequest } from "next/server";
import { createCategoriesProducts, getAllCategoriesProducts } from "@/src/controllers/categories_productsControllers";

//GET
export async function GET() {
  try {
    const categories_products = await getAllCategoriesProducts();
    return NextResponse.json({ categories_products }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/categories_products error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


//POST
export async function POST(req: Request) {
  try {
    const categories_productsItem = await req.json();
    const categories_products = await createCategoriesProducts(categories_productsItem);
    return NextResponse.json({ categories_products }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/categories_products error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}