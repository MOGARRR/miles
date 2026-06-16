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
    <div>
      <LinkButton href="/admin/orders" variant="secondary" className="mt-0 mb-6">
        Back
      </LinkButton>
      <AdminOrdersClient orderId={(await params).id} orderInfo={orderData} />
    </div>
  );
}
