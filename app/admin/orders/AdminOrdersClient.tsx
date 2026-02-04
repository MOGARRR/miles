"use client";
import React, { FC } from "react";
import { orderData } from "@/src/types/orderData";
import { formatDate } from "@/src/helpers/formatDate";
import Image from "next/image";

interface AdminOrderProps {
  orderInfo: orderData;
}

const shortenUrl = (url: string) => {
  const splitUrl = url.split("");
  return splitUrl.slice(0, 61);
};

const AdminOrdersClient: FC<AdminOrderProps> = ({ orderInfo }) => {
  return (
    <div>
      <section>
        <h1>Order Info: </h1>
        <div>
          <p>Order Number / ID : {orderInfo.id}</p>
          <p>Order Status: {orderInfo.status}</p>
          <p className="max-w-full break-all overflow-hidden">
            Stripe Session ID : {orderInfo.stripe_session_id}
          </p>
          <p>Total Order Amount: ${orderInfo.total_cents / 100}</p>
          <p>Payment Status: {orderInfo.payment_status}</p>
          <p>Order Created : {formatDate(orderInfo.created_at)}</p>
          <p>Order Last Updated : {formatDate(orderInfo.updated_at)}</p>
        </div>
        <br />
        <br />
        <h1>Order Items: </h1>
        <section className="flex">
          {orderInfo.order_products.map((productData: any) => (
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
          <p>Customer Name: {orderInfo.full_name}</p>
          <p>Address Line 1: {orderInfo.address_line_1}</p>
          <p>Address Line 2: {orderInfo.address_line_2 || "N/A"}</p>
          <p>Postal : {orderInfo.postal}</p>
          <p>City : {orderInfo.city}</p>
          <p>email : {orderInfo.email}</p>
          <p>Phone Number : {orderInfo.phone_number}</p>
        </div>
        <br />
        <br />
        <h1>Shipping Info:</h1>
        <div>
          <p>
            Shipping Status:
            <select name="shipping_status" id="shipping-status">
              <option className="bg-gray-800" value="pending">
                Pending
              </option>
              <option className="bg-gray-800" value="shipped">
                Shipped
              </option>
              <option className="bg-gray-800" value="delivered">
                Delivered
              </option>
            </select>
          </p>
          <p>Shipping Fee : ${orderInfo.shipping_fee_cents / 100} </p>
        </div>
        <p>Tracking Number : {orderInfo.tracking_number}</p>
        <p>
          Label URL:
          <a className="text-blue-400 underline" href={orderInfo.label_url}>
            {" "}
            {shortenUrl(orderInfo.label_url)}
          </a>
        </p>
        {/* Add formatDate function if real labels need it */}
        <p>Estimated Delivery Time: {orderInfo.estimated_delivery || "N/A"}</p>
      </section>
    </div>
  );
};

export default AdminOrdersClient;
