import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

//GET  
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orders_productsId = params.id;
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("Orders_products")
    .select("*")
    .eq("id", orders_productsId)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders_products: data });
}
