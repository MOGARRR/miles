import { NextResponse, NextRequest } from 'next/server'
import { createClient } from "@/utils/supabase/server";


//GET
export async function GET() {
const supabase = await createClient();
  let { data  , error } = await supabase.from("Orders").select("*");

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders: data })
}  


export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const orderItem = await req.json();
  let { data, error } = await supabase
    .from("Orders")
    .insert([
      {
      customer_id : orderItem.customer_id,
      total_cents : orderItem.total_cents,
      shopping_fee_cents : orderItem.shopping_fee_cents,
      stripe_session_id : orderItem.stripe_session_id,
      status : orderItem.status,
      updated_at : null,
      payment_status : orderItem.payment_status,
      tracking_number : orderItem.tracking_number,
      label_url : orderItem.label_url,
      estimated_delivery : orderItem.estimated_delivery,
      shipping_status : orderItem.shipping_status,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}