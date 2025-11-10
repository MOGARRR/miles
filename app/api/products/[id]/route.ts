import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

//GET
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}


// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const supabase = await createClient();
  const updatedProductItem = await req.json();
  const updates = Object.fromEntries(
    Object.entries(updatedProductItem) // turn into array of key/values
      .filter(([_, v]) => v !== undefined) // filter out any undefined values
  );

  updates.updated_at = new Date().toISOString(); // adds update time

  let { data, error } = await supabase
    .from("Products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}