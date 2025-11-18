import { NextResponse} from "next/server";
import { getAllProducts, createProduct } from "@/src/controllers/productControllers";

//GET
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/products error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//POST
export async function POST(req: Request) {
  try {
    const productItem = await req.json();
    const product = await createProduct(productItem);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/product error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

