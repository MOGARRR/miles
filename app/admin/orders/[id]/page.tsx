import React from "react";
import Image from "next/image";
import { getOrderWithProducts } from "@/src/controllers/orderControllers";
import Link from "next/link";
import { formatDate } from "@/src/helpers/formatDate";
import AdminOrdersClient from "../AdminOrdersClient";

interface OrderDetailsProps {
  params: {
    id: string;
  };
}

const shortenUrl = (url: string) => {
  const splitUrl = url.split("");
  return splitUrl.slice(0, 61);
};

export default async function OrderDetailsPage({ params }: OrderDetailsProps) {
  const orderData = await getOrderWithProducts(params.id);

  return (
    <div>
      <Link href={"/admin/orders"}>
        <button className="bg-gray-400 p-2 rounded-lg">Back</button>
      </Link>{" "}
      <br />
      <br />
      <AdminOrdersClient orderInfo={orderData} />
    </div>
  );
}
