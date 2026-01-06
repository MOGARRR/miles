import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/app/lib/sendEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  // Verify Stripe Signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      console.warn("No customer email found:", session.id);
      return NextResponse.json({ received: true });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    // Email Format, Change before Production
    const html = `
      <h1>Test</h1>
      <p><strong>Order Items:</strong>

      <ul>
        ${lineItems.data
          .map(
            (item) => `
              <li>
                ${item.description} × ${item.quantity ?? 1}  - 
                $${(item.amount_total! / 100).toFixed(2)}
              </li>
            `
          )
          .join("")}
      </ul>

      <p><strong>Total paid:</strong> $${(session.amount_total! / 100).toFixed(2) }</p>
    `;

    await sendEmail({
      to: "alicea.9a@gmail.com",
      subject: "KiloBoy Order Receipt",
      html,
    });
  }

  return NextResponse.json({ received: true });
}
