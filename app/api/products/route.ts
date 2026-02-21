import { NextResponse} from "next/server";
import { getAllProducts, createProductWithCategories } from "@/src/controllers/productControllers";


/**
 * GET /api/products
 *
 * Supports pagination for the products gallery (infinite scroll / discovery view).
 * Query params:
 *  - page: page number (1-based)
 *  - limit: number of products per request (default: 9)
 */
export async function GET(req: Request) {
  
  try {

    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;
    const search = searchParams.get("search") || "";
    const searchType = searchParams.get("searchType") === "true";

    // Convert page to offset for database queries
    // page 1 -> offset 0
    // page 2 -> offset limit
    const offset = (page - 1) * limit;

    // Fetch paginated products from the controller
    const products = await getAllProducts({ limit, offset, search, searchType });

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

    const product = await createProductWithCategories(productItem);
    
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/product error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


