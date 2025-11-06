import { NextResponse } from 'next/server'
import { createClient } from "@/utils/supabase/server";


//GET
export async function GET() {
const supabase = await createClient();
  let { data  , error } = await supabase.from("Orders").select("*");

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ users: data })
}  
