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
        <button className="
                  w-20
                  mt-3 text-md  
                  bg-gray-500 
                  p-2 
                  rounded-full border
                  cursor-pointer
                  hover:bg-gray-600">Back</button>
      </Link>{" "}
      <br />
      <br />
      <AdminOrdersClient orderId={params.id}orderInfo={orderData} />
    </div>
  );
}
