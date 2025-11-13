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


// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orders_productsId = params.id;
  const supabase = await createClient();
  const updatedOrders_productsItem = await req.json();
  const updates = Object.fromEntries(
    Object.entries(updatedOrders_productsItem) // turn into array of key/values
      .filter(([_, v]) => v !== undefined) // filter out any undefined values
  );

  let { data, error } = await supabase
    .from("Orders_products")
    .update(updates)
    .eq("id", orders_productsId)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders_products: data });
}



// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orders_productsId = params.id;
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("Orders_products")
    .delete()
    .eq("id", orders_productsId)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders_products: data });
}