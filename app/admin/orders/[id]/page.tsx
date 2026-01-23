import React from "react";
import Image from "next/image";
import { getOrderWithProducts } from "@/src/controllers/orderControllers";
import Link from "next/link";
import { formatDate } from "@/src/helpers/formatDate";

interface OrderDetailsProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailsPage({ params }: OrderDetailsProps) {
  const orderData = await getOrderWithProducts(params.id);

  return (
    <div>
      <Link href={'/admin/orders'}>
      <button className="bg-gray-400 p-2 rounded-lg">Back</button>
      </Link> <br /><br />
      <section>
        <h1>Order Info: </h1>
        <div>
          <p>Order Number / ID : {orderData.id}</p>
          <p>Order Status: {orderData.status}</p>
          <p className="max-w-full break-all overflow-hidden">
            Stripe Session ID : {orderData.stripe_session_id}
          </p>
          <p>Total Order Amount: ${orderData.total_cents / 100}</p>
          <p>Payment Status: {orderData.payment_status}</p>
          <p>Order Created : {formatDate(orderData.created_at)}</p>
          <p>Order Last Updated : {formatDate(orderData.updated_at)}</p>
        </div>
        <br />
        <br />
        <h1>Order Items: </h1>
        <section className="flex">
          {orderData.order_products.map((productData: any) => (
            <div key={productData.id} className="m-5">
              <p>Product Number / ID : {productData.products.id}</p>
              <p>Product Name: {productData.products.title}</p>
              <Image
                className="h-30 w-30 object-cover"
                src={productData.products.image_URL}
                width={100}
                height={100}
                alt={productData.products.description}
              />
              <p>Product Price: ${productData.unit_price_cents / 100}</p>
              <p>QTY: {productData.quantity}</p>
            </div>
          ))}
        </section>{" "}
        <h1>Customer Info:</h1>
        <div>
          <p>Customer Name: {orderData.full_name}</p>
          <p>Address Line 1: {orderData.address_line_1}</p>
          <p>Address Line 2: {orderData.address_line_2 || 'N/A'}</p>
          <p>Postal : {orderData.postal}</p>
          <p>City : {orderData.city}</p>
          <p>email : {orderData.email}</p>
          <p>Phone Number : {orderData.phone_number}</p>
        </div>
        <br />
        <br />
        <h1>Shipping Info:</h1>
        <div>
          <p>Shipping Status : {orderData.shipping_status}</p>
          <p>Shipping Fee : ${orderData.shipping_fee_cents / 100} </p>
        </div>
        <p>Tracking Number : {orderData.tracking_number}</p>
        <p className="max-w-full break-all overflow-hidden">
          Label URL: {orderData.label_url}
        </p> 
        {/* Add formatDate function if real labels need it */}
        <p>Estimated Delivery Time: {orderData.estimated_delivery || "N/A"}</p>
      </section>
    </div>
  );
}
