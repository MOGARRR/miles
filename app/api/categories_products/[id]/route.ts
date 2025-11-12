import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

//GET
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const categoriesProductsId = params.id;
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("Categories_products")
    .select("*")
    .eq("id", categoriesProductsId)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories_products: data });
}

//POST