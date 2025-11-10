import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

//GET 
export async function GET() {
  const supabase = await createClient();
  let { data, error } = await supabase.from("Categories_products").select("*");

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

//Post
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const categoriesProductsItem = await req.json();
  let { data, error } = await supabase
    .from("Categories_products")
    .insert([
      {
      title : categoriesProductsItem.title,
      description : categoriesProductsItem.description,
      image_URL : categoriesProductsItem.image_URL,
      updated_at : categoriesProductsItem.updated_at,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories_products: data });
}
