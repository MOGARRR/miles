import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/app/lib/emails/sendEmail";
import { createShippingLabel } from "@/app/lib/shipping/createShippingLabel";
import {
  createOrder,
  getOrderByStripeSessionId,
  updateOrder,
} from "@/src/controllers/orderControllers";
import { createOrderProduct } from "@/src/controllers/order_productsControllers";
import { DistanceUnitEnum, WeightUnitEnum } from "shippo";

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
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });

    // Get product meta data information
    const orderItems = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product | null;
      return {
        productId: product?.metadata?.productId ?? null,
        quantity: item.quantity ?? 1,
        amount_total: item.amount_total,
        description: item.description,
      };
    });

    // Filter out Hst and shipping from meta data
    const filteredOrderItems = orderItems.filter((item) => item.productId);

    // /// Email Formatting
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
      console.warn(
        "Incomplete shipping address from Stripe metadata",
        session.id
      );
      return NextResponse.json({ received: true });
    }

    /// Check if order exist to prevent duplicates
    const existingOrder = await getOrderByStripeSessionId(session.id);
    if (existingOrder) {
      console.log("Order already processed:", session.id);
      return NextResponse.json({ received: true });
    }

    /// Create order to DB
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
      phone_number: shipping.phoneNumber,
    });

    //// Create order products to DB
    await Promise.all(
      filteredOrderItems.map((item) => {
        createOrderProduct({
          product_id: item.productId,
          order_id: order.id,
          quantity: item.quantity,
          unit_price_cents: item.amount_total,
        });
      })
    );

    try {
      /// Create/Buy Shipping label for owner
      const label = await createShippingLabel({
        addressTo: {
          name: shipping.name,
          phone: shipping.phoneNumber,
          street1: shipping.address1,
          street2: shipping.address2,
          city: shipping.city,
          state: shipping.province,
          zip: shipping.postal,
          country: shipping.country,
        },
        /// UPDATE WHEN PARCEL WITH REAL DATA WHEN AVAILABLE
        parcel: {
          length: "10",
          width: "8",
          height: "4",
          weight: "2",
          distanceUnit: DistanceUnitEnum.In,
          massUnit: WeightUnitEnum.Lb,
        },
      });
      ///////////////////
      try {
        /// Send Email Receipt to Customer Email
        await sendEmail({
          to: "alicea.9a@gmail.com", /// REPLACE WITH customerEmail BEFORE PRODUCTION
          subject: "KiloBoy Order Receipt",
          html,
        });
      } catch (err) {
        console.error("EMAIL FAILED:", err);
      }
      ////////////////////

      try {
        // Update order with shipping label information
        await updateOrder(order.id, {
          updated_at: new Date().toISOString(),
          shipping_fee_cents: Math.round(Number(label.shippingFeeCents) * 100),
          tracking_number: label.trackingNumber,
          estimated_delivery: label.estimatedDelivery,
          shipping_status: label.shippingStatus,
          label_url: label.labelUrl,
        });
      } catch (err) {
        console.error("UPDATING ORDER FAILED:", err);
      }
      /////////////////////
    } catch {
      /////////////////////

      try {
        // Update order shipping status if label creation failed
        await updateOrder(order.id, {
          shipping_status: "FAILED",
        });
      } catch (err) {
        console.error("ORDER UPDATE FAILED (LABEL FAILURE):", err);
      }
      ///////////////////////
    }
  }

  return NextResponse.json({ received: true });
}
