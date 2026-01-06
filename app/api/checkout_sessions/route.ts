import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "../../lib/stripe";


export async function POST(req: Request) {
  try {
    const { cart, shippingCents, hstCents } = await req.json();
    const headersList = await headers();
    const origin = headersList.get("origin");
    // Create Checkout Sessions from body params.
    const line_items = [
      ...cart.map((item: any) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: item.title,
          },
          unit_amount: item.price_cents, // already in cents
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: "cad",
          product_data: { name: "HST (13%)" },
          unit_amount: hstCents,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "cad",
          product_data: { name: "Shipping" },
          unit_amount: shippingCents,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/checkout_success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
