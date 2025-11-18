import { NextResponse,  NextRequest } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/src/controllers/productControllers";


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);
    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/products error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT 
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const updatedProductItem = await req.json();

    const result = await updateProduct(productId, updatedProductItem);

    return NextResponse.json({ products: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;

    const result = await deleteProduct(productId);

    return NextResponse.json({ users: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

