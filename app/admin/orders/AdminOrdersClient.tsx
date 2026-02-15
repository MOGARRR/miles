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

      <section
        className="
        flex-col
        p-4 mb-6
        "
      >
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
              Order Info:{" "}
            </h1>
            <div>
              <section className="flex justify-evenly text-center">
                <div>
                  <h2 className="text-lg">Order ID :</h2>
                  <p> #{orderInfo.id}</p>
                </div>
                <div>
                  <h2 className="text-lg">Order Status:</h2>
                  <p>{orderInfo.status}</p>
                </div>
                <div>
                  <h2 className="text-lg">Payment Status: </h2>
                  <p>{orderInfo.payment_status}</p>
                </div>
                <div>
                  <h2 className="text-lg">Total Order Amount:</h2>
                  <p>${orderInfo.total_cents / 100}</p>
                </div>
                
              </section>
              <h2 className="text-lg text-center mt-4"> Stripe Session ID :</h2>
              <p className="max-w-full break-all overflow-hidden text-sm">
                {orderInfo.stripe_session_id}
              </p>

              <section className="flex justify-around">
                <div>
                  <h2 className="text-lg">Order Created :</h2>
                  <p>{formatDate(orderInfo.created_at)}</p>
                </div>
                <div>
                  <h2 className="text-lg">Order Last Updated:</h2>
                  <p> {formatDate(orderInfo.updated_at)}</p>
                </div>
              </section>
            </div>
          </section>
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
            <div>
              <p>Customer Name: {orderInfo.full_name}</p>
              <p>Address Line 1: {orderInfo.address_line_1}</p>
              <p>Address Line 2: {orderInfo.address_line_2 || "N/A"}</p>
              <p>Postal : {orderInfo.postal}</p>
              <p>City : {orderInfo.city}</p>
              <p>email : {orderInfo.email}</p>
              <p>Phone Number : {orderInfo.phone_number}</p>
            </div>
          </section>
        </div>

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
            <section>
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
            </section>
          </section>

          <section
            className="
            w-2/5  
            bg-gray-800 
            p-4 mb-6
            rounded-md border
            "
          >
            <div>
              <h1
                className="
              text-2xl text-center text-kilored
              border-b-1 
              mb-2
              "
              >
                Shipping Info:
              </h1>
              <p>Shipping Status: {orderInfo.shipping_status}</p>
              <p>Shipping Fee : ${orderInfo.shipping_fee_cents / 100} </p>
            </div>
            <p>Tracking Number : {orderInfo.tracking_number}</p>
            <p>
              Label URL:
              {!orderInfo.label_url && " N/A"}
              <a
                className="text-blue-400 underline"
                target="blank"
                href={orderInfo.label_url}
              >
                {" "}
                {orderInfo.label_url && shortenUrl(orderInfo.label_url)}
              </a>
            </p>
            {/* Add formatDate function if real labels need it */}
            <p>
              Estimated Delivery Time:
              {!orderInfo.estimated_delivery && " N/A"}
              {orderInfo.estimated_delivery}
            </p>
          </section>
        </div>
      </section>
    </div>
  );
};

export default AdminOrdersClient;
