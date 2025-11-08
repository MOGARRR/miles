import { NextResponse, NextRequest } from 'next/server'
import { createClient } from "@/utils/supabase/server";

export async function GET() {
const supabase = await createClient();
  let { data  , error } = await supabase.from("Users").select("*");

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ users: data })
}

//Post
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const userItem = await req.json();
  let { data, error } = await supabase
    .from("Users")
    .insert([
      {
        first_name: userItem.first_name,
        last_name: userItem.last_name,
        phone_number: userItem.phone_number,
        address_line_1: userItem.address_line_1,
        address_line_2: userItem.address_line_2,
        postal_code: userItem.postal_code,
        city: userItem.city,
        province: userItem.province,
        country: userItem.country,
        email: userItem.email,
        is_admin: userItem.is_admin,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}