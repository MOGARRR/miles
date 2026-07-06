import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/src/helpers/emails/sendEmail";
import { createShippingLabel } from "@/app/lib/shipping/createShippingLabel";
import {
  createOrderForStripeSession,
  getOrderByStripeSessionId,
} from "@/src/controllers/orderControllers";
import { createOrderProduct } from "@/src/controllers/order_productsControllers";
import { DistanceUnitEnum, WeightUnitEnum } from "shippo";
import { decrementProductSizeStock } from "@/src/controllers/inventoryControllers";
import createParcels from "@/src/helpers/createParcels";
import { formatCustomerEmail } from "@/src/emails/formatCustomerEmails";
import { formatOrderEmail } from "@/src/emails/formatOrderEmails";


/**
 * Stripe webhook handler
 *
 * NOTE:
 * - This file is primarily responsible for post-payment side effects:
 *   - order creation
 *   - order_products creation
 *   - shipping label generation
 *   - confirmation emails
 *
 * Inventory updates are intentionally handled here (and not on the frontend)
 * to avoid race conditions and overselling.
 */


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
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    // IMPORTANT:
    // Each Stripe line item must include `productSizeId` in metadata
    // when the checkout session is created.
    // This allows us to safely decrement inventory for the correct size.
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });

    // Get product meta data information
    // NOTE: Inventory is tracked at the product_size level (not product level)
    const orderItems = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product | null;
      return {
        productId: product?.metadata?.productId ?? null,

        // Product size ID (used for inventory decrement)
        productSizeId: product?.metadata?.productSizeId ?? null,
        sizeLabel: product?.metadata?.sizeLabel ?? null,
        quantity: item.quantity ?? 1,
        amount_total: item.amount_total,
        description: item.description,
        
      };
    });

    // Filter out Hst and shipping from meta data
    const filteredOrderItems = orderItems.filter(
      (item) => item.productId && item.productSizeId
    );

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
        session.id,
      );
      return NextResponse.json({ received: true });
    }

    /// Check if order exist to prevent duplicates
    const existingOrder = await getOrderByStripeSessionId(session.id);
    if (existingOrder) {
      console.log("Order already processed:", session.id);
      return NextResponse.json({ received: true });
    }

    /// Create order first so concurrent webhooks can dedupe before side effects
    const { order, isNew } = await createOrderForStripeSession({
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

    if (!isNew) {
      console.log("Order already processed:", session.id);
      return NextResponse.json({ received: true });
    }

    /**
     * INVENTORY UPDATE
     * Inventory is decremented ONLY after Stripe confirms payment
     * via `checkout.session.completed`.
     */

    try {
      await Promise.all(
        filteredOrderItems.map((item) =>
          decrementProductSizeStock(
            Number(item.productSizeId),
            item.quantity
          )
        )
      );
    } catch (err) {
      console.error("Inventory update error:", err);
      throw err; // Stripe will retry the webhook
    }

    //// Create order products to DB
    await Promise.all(
      filteredOrderItems.map((item) => {
        createOrderProduct({
          product_id: item.productId,
          order_id: order.id,
          quantity: item.quantity,
          unit_price_cents: item.amount_total,
        });
      }),
    );

          
      ///////////////////
      try {
        /// Send Email Receipt to Customer Email
        await sendEmail({
          to: customerEmail,
          subject: "KiloBoy Order Receipt",
          html: formatCustomerEmail(
            orderItems,
            session.amount_total,
            shipping as any,
            customerEmail
          ),
        });
      } catch (err) {
        console.error("EMAIL FAILED:", err);
      }
      ////////////////////

      ///////////////////
      try {
        /// Send Miles New Order Email
        await sendEmail({
          to: process.env.CONTACT_TO_EMAIL! ,
          subject: "New KiloBoy Order!",
          html: formatOrderEmail(
            orderItems,
            session.amount_total,
            shipping as any,
            customerEmail
          ),
        });
      } catch (err) {
        console.error("EMAIL FAILED:", err);
      }
      ////////////////////
  }

  return NextResponse.json({ received: true });
}
