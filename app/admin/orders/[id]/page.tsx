import React from "react";
import { getOrderWithProducts } from "@/src/controllers/orderControllers";
import { stripe } from "@/app/lib/stripe";
import LinkButton from "@/app/components/ui/LinkButton";
import AdminOrdersClient from "../AdminOrdersClient";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const orderId = (await params).id;
  const orderData = await getOrderWithProducts(orderId);

  const itemLabels: Record<string, string> = {};
  if (orderData.stripe_session_id) {
    const session = await stripe.checkout.sessions.retrieve(
      orderData.stripe_session_id,
      { expand: ["line_items"] },
    );
    for (const item of session.line_items?.data ?? []) {
      const desc = item.description;
      if (!desc || desc === "HST (13%)" || desc === "Shipping") continue;
      const m = desc.match(/^(.*) \(([^)]+)\)\s*$/);
      itemLabels[m ? m[1].trim() : desc] = desc;
    }
  }

  return (
    <div className="pt-8 px-8">
      <LinkButton href="/admin/orders" variant="secondary">
        Back to Orders
      </LinkButton>
      <AdminOrdersClient
        orderId={orderId}
        orderInfo={orderData}
        itemLabels={itemLabels}
      />
    </div>
  );
}