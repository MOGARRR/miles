import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/app/lib/emails/sendEmail";
import { createShippingLabel } from "@/app/lib/shipping/createShippingLabel";
import {
  createOrder,
  getOrderByStripeSessionId,
} from "@/src/controllers/orderControllers";
import { DistanceUnitEnum, WeightUnitEnum } from "shippo";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const normalizePhone = (phone: string) =>
  phone.replace(/[^\d]/g, "").slice(0, 15);

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
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    const shipping = {
      name: session.metadata?.shipping_name,
      phoneNumber: session.metadata?.shipping_phone_number,
      address1: session.metadata?.shipping_address1,
      address2: session.metadata?.shipping_address2 ?? "",
      city: session.metadata?.shipping_city,
      province: session.metadata?.shipping_province,
      postal: session.metadata?.shipping_postal,
      country: "CA",
    };

    if (!customerEmail) {
      console.warn("No customer email found:", session.id);
      return NextResponse.json({ received: true });
    }

    if (
      !shipping.name ||
      !shipping.phoneNumber ||
      !shipping.address1 ||
      !shipping.city ||
      !shipping.province ||
      !shipping.postal
    ) {
      throw new Error("Incomplete shipping address from Stripe metadata");
    }

    const existingOrder = await getOrderByStripeSessionId(session.id);
    if (existingOrder) {
      console.log("Order already processed:", session.id);
      return NextResponse.json({ received: true });
    }

    const label = await createShippingLabel({
      addressTo: {
        name: shipping.name,
        phone: normalizePhone(shipping.phoneNumber),
        street1: shipping.address1,
        street2: shipping.address2,
        city: shipping.city,
        state: shipping.province,
        zip: shipping.postal,
        country: shipping.country,
      },
      parcel: {
        length: "10",
        width: "8",
        height: "4",
        weight: "2",
        distanceUnit: DistanceUnitEnum.In,
        massUnit: WeightUnitEnum.Lb,
      },
    });

    const order = await createOrder({
      stripe_session_id: session.id,
      email: customerEmail,
      status: "PAID",
      payment_status: session.payment_status,
      total_cents: session.amount_total,
      full_name: shipping.name,
      address_line_1: shipping.address1,
      address_line_2: shipping.address2,
      city: shipping.city,
      province: shipping.province,
      postal: shipping.postal,
      shopping_fee_cents: Math.round(Number(label.shoppingFeeCents) * 100),
      tracking_number: label.trackingNumber,
      estimated_delivery: label.estimatedDelivery,
      shipping_status: label.shippingStatus,
      label_url: label.labelUrl,
      phone_number: normalizePhone(shipping.phoneNumber),
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

      <p><strong>Total paid:</strong> $${(session.amount_total! / 100).toFixed(
        2
      )}</p>
    `;

    await sendEmail({
      to: "alicea.9a@gmail.com",
      subject: "KiloBoy Order Receipt",
      html,
    });
  }

  return NextResponse.json({ received: true });
}
