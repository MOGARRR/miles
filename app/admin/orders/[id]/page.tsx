import React from "react";
import { getOrderWithProducts } from "@/src/controllers/orderControllers";
import Link from "next/link";
import AdminOrdersClient from "../AdminOrdersClient";

interface OrderDetailsProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailsPage({ params }: OrderDetailsProps) {
  const orderData = await getOrderWithProducts(params.id);

  return (
    <div>
      <Link href={"/admin/orders"}>
        <button className="bg-gray-400 p-2 rounded-lg">Back</button>
      </Link>{" "}
      <br />
      <br />
      <AdminOrdersClient orderId={params.id}orderInfo={orderData} />
    </div>
  );
}
