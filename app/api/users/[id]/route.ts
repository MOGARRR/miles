import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

//GET
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const supabase = await createClient();
  const updatedUserItem = await req.json();
  const updates = Object.fromEntries(
    Object.entries(updatedUserItem) // turn into array of key/values
      .filter(([_, v]) => v !== undefined) // filter out any undefined values
  );
  let { data, error } = await supabase
    .from("Users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

// DELETE
export async function DELETE (
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("Users")
    .delete()
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}