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

// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  const supabase = await createClient();
  const updatedCategoriesItem = await req.json();
  const updates = Object.fromEntries(
    Object.entries(updatedCategoriesItem) // turn into array of key/values
      .filter(([_, v]) => v !== undefined) // filter out any undefined values
  );

  updates.updated_at = new Date().toISOString(); // adds update time

  let { data, error } = await supabase
    .from("Categories_products")
    .update(updates)
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories_products: data });
}
