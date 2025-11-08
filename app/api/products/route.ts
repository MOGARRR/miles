import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  let { data, error } = await supabase.from("Products").select("*");

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

//Post
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const productItem = await req.json();
  let { data, error } = await supabase
    .from("Products")
    .insert([
      {
        price_cents: productItem.price_cents,
        title: productItem.title,
        description: productItem.description,
        category_id: productItem.category_id,
        image_URL: productItem.image_URL,
        sold_out: productItem.sold_out,
        is_available: productItem.is_available,
        updated_at: null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}
