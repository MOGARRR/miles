import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  let { data, error } = await supabase.from("Orders_products").select("*");

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders_products: data });
}

//Post
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const orders_productsItem = await req.json();
  let { data, error } = await supabase
    .from("Orders_products")
    .insert([
      {
        quantity: orders_productsItem.quantity,
        unit_price_cents: orders_productsItem.unit_price_cents,
        order_id: orders_productsItem.order_id,
        product_id: orders_productsItem.product_id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders_products: data });
}
