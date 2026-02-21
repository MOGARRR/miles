import { NextResponse, NextRequest } from "next/server";
import { createCategoriesProducts, getAllCategories } from "@/src/controllers/categoriesControllers";

//GET
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/categories error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


//POST
export async function POST(req: Request) {
  try {
    const categoriesItem = await req.json();
    const categories = await createCategoriesProducts(categoriesItem);
    return NextResponse.json({ categories }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/categories error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}