import React from "react";
import { getOrderWithProducts } from "@/src/controllers/orderControllers";
import LinkButton from "@/app/components/ui/LinkButton";
import AdminOrdersClient from "../AdminOrdersClient";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const orderData = await getOrderWithProducts( (await params).id);

  return (
    <div className="pt-8 px-8">
      <LinkButton href="/admin/orders" variant="secondary">
        Back to Orders
      </LinkButton>
      <AdminOrdersClient orderId={(await params).id} orderInfo={orderData} />
    </div>
  );
}
