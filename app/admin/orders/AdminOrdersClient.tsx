"use client";
import React, { FC, useState } from "react";
import { orderData } from "@/src/types/orderData";
import { formatDate } from "@/src/helpers/formatDate";
import Image from "next/image";
import OrderForm from "./OrderForm";
interface AdminOrderProps {
  orderInfo: orderData;
  orderId: string;
}

const shortenUrl = (url: string) => {
  const splitUrl = url.split("");
  return splitUrl.slice(0, 61);
};

const AdminOrdersClient: FC<AdminOrderProps> = ({ orderId, orderInfo }) => {
  const [updateForm, setUpdateForm] = useState(false);

  const orderFormInfo = {
    customerName: orderInfo.full_name,
    address1: orderInfo.address_line_1,
    address2: orderInfo.address_line_2,
    postal: orderInfo.postal,
    city: orderInfo.city,
    province: orderInfo.province,
    email: orderInfo.email,
    phone: orderInfo.phone_number,
    shippingStatus: orderInfo.shipping_status,
    trackingNumber: orderInfo.tracking_number,
    labelUrl: orderInfo.label_url,
    estimatedDelivery: orderInfo.estimated_delivery,
  };

  const handleUpdateForm = () => setUpdateForm(!updateForm);

  return (
    <div>
      {/*Update Button and Form*/}
      <button
        className="
        my-3
        text-md  
        bg-gray-500 
        p-2 
        rounded-full border
        cursor-pointer
        hover:bg-gray-600"
        onClick={handleUpdateForm}
      >
        {updateForm ? "Close" : "Update Info"}
      </button>
      {updateForm && (
        <OrderForm
          id={orderId}
          updateFormInfo={orderFormInfo}
          onClose={() => setUpdateForm(false)}
        />
      )}
      {/*  */}

      {/* Order Details*/}
      <section
        className="
        flex-col
        p-4 mb-6
        "
      >
        {/* Order Info Section */}
        <div className="flex justify-around">
          <section
            className="
            flex flex-col justify-between
             w-2/5 
             bg-gray-800 
             p-4 mb-6
             rounded-md border 
             "
          >
            <h1
              className="
              text-2xl text-center text-kilored
              border-b-1 
              mb-2
              "
            >
              Order Info:
            </h1>

            {/* Order Info Top*/}
            <section className="flex justify-evenly text-center text-xl my-2">
              <div>
                <h2>Order ID :</h2>
                <p> #{orderInfo.id}</p>
              </div>
              <div>
                <h2>Order Status:</h2>
                <p>{orderInfo.status}</p>
              </div>
              <div>
                <h2>Payment Status: </h2>
                <p>{orderInfo.payment_status}</p>
              </div>
              <div>
                <h2>Total Order Amount:</h2>
                <p>${orderInfo.total_cents / 100}</p>
              </div>
            </section>
            {/* Order Info Middle */}
            <section className="my-2 self-center">
              <h2 className="text-xl text-center"> Stripe Session ID :</h2>
              <p
                className="
                    max-w-full 
                    break-all overflow-hidden 
                    text-sm text-center
                    "
              >
                {orderInfo.stripe_session_id}
              </p>
            </section>
            {/* Order Info Bottom */}
            <section className="flex justify-around mt-2">
              <div>
                <h2 className="text-xl">Order Created :</h2>
                <p>{formatDate(orderInfo.created_at)}</p>
              </div>
              <div>
                <h2 className="text-xl">Order Last Updated:</h2>
                <p> {formatDate(orderInfo.updated_at)}</p>
              </div>
            </section>
            {/*  */}
          </section>

          {/* Order Info End */}

          {/* Customer Info Section */}
          <section
            className="
            w-2/5 
            bg-gray-800 
            p-4 mb-6
            rounded-md border
            "
          >
            <h1
              className="
              text-2xl text-center text-kilored
              border-b-1 
              mb-2
            "
            >
              Customer Info:
            </h1>
            <div className="text-lg text-center flex justify-around">
              <section>
                <div>
                  <h2 className="text-xl my-1">Customer Name: </h2>
                  {orderInfo.full_name}
                </div>
                <div>
                  <h2 className="text-xl my-1">email :</h2> {orderInfo.email}
                </div>
                <div>
                  <h2 className="text-xl my-1">Phone Number : </h2>
                  {orderInfo.phone_number}
                </div>
              </section>
              <section>
                <div>
                  {" "}
                  <h2 className="text-xl my-1">Address Line 1:</h2>{" "}
                  {orderInfo.address_line_1}
                </div>
                <div>
                  {" "}
                  <h2 className="text-xl my-1">Address Line 2:</h2>{" "}
                  {orderInfo.address_line_2 || "N/A"}
                </div>
                <div>
                  {" "}
                  <h2 className="text-xl my-1">Postal :</h2> {orderInfo.postal}
                </div>
                <div>
                  {" "}
                  <h2 className="text-xl my-1">City : </h2>
                  {orderInfo.city}
                </div>
              </section>
            </div>
          </section>
        </div>
        {/* Customer Info Section End */}

        {/* Order Items Section */}
        <div className="flex justify-around">
          <section
            className="
            w-2/5 
            bg-gray-800 
            p-4 mb-6
            rounded-md border
        "
          >
            <h1
              className="
              text-2xl text-center text-kilored
              border-b-1 
              mb-2
            "
            >
              Order Items:{" "}
            </h1>
            <section className="grid grid-cols-3">
              {orderInfo.order_products.map((productData: any) => (
                <div key={productData.id} className="m-5  text-center">
                  <Image
                    className="
                    h-30 w-30 
                    object-cover
                    rounded-lg 
                    mb-2 ml-6
                    "
                    src={productData.products.image_URL}
                    width={100}
                    height={100}
                    alt={productData.products.description}
                  />
                  <div className="my-1 text-lg ">
                    <h2>Product ID:</h2> #{productData.products.id}
                  </div>
                  <div className="my-1 text-lg">
                    <h2>Product Name:</h2>
                    {productData.products.title}
                  </div>
                  <div className="my-1 text-lg">
                    <h2>Product Price:</h2>${productData.unit_price_cents / 100}
                  </div>
                  <div className="my-1 text-lg">
                    <h2>QTY: </h2>
                    {productData.quantity}
                  </div>
                </div>
              ))}
            </section>
          </section>
          {/* Order Items End */}

          {/* Shipping Info Section */}
          <section
            className="
            flex flex-col justify-between
            w-2/5 max-h-70
            bg-gray-800 
            p-4
            rounded-md border
            "
          >
            <h1
              className="
                text-2xl text-center text-kilored
                border-b-1 
                "
            >
              Shipping Info:
            </h1>
            {/* Shipping Info Top */}
            <section className="flex justify-evenly text-xl text-center">
              <div>
                <h2>Shipping Status:</h2>
                {orderInfo.shipping_status}
              </div>
              <div>
                <h2>Shipping Fee:</h2> $
                {orderInfo.shipping_fee_cents / 100}{" "}
              </div>
              {/* Add formatDate function if real labels need it */}
              <div>
                <h2>Estimated Delivery:</h2>

                {!orderInfo.estimated_delivery && " N/A"}
                {orderInfo.estimated_delivery}
              </div>
            </section>

            {/* Shipping Info Bottom */}
            <section className="text-center">
              <div>
                <h2 className="text-xl">Tracking Number:</h2>{" "}
                {orderInfo.tracking_number}
              </div>
              <div>
                <h2 className="text-xl">Label URL:</h2>

                {!orderInfo.label_url && " N/A"}
                <a
                  className="text-blue-400 underline mb-4"
                  target="blank"
                  href={orderInfo.label_url}
                >
                  {orderInfo.label_url && shortenUrl(orderInfo.label_url)}
                </a>
              </div>
            </section>
          </section>
        </div>
      </section>
      {/* Shipping Info End */}
    </div>
  );
};

export default AdminOrdersClient;
