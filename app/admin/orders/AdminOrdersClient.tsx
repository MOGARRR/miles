"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { orderData } from "@/src/types/orderData";
import { formatDate } from "@/src/helpers/formatDate";
import Image from "next/image";
import OrderForm from "./OrderForm";
import Button from "@/app/components/ui/Button";
import AdminInput from "@/app/components/ui/AdminInput";

interface AdminOrderProps {
  orderInfo: orderData;
  orderId: string;
  itemLabels: Record<string, string>;
}

const AdminOrdersClient: FC<AdminOrderProps> = ({
  orderId,
  orderInfo,
  itemLabels,
}) => {
  const router = useRouter();
  const [updateForm, setUpdateForm] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");

  // Show the form only if the order has not been shipped yet
  const alreadyShipped = orderInfo.shipping_status === "Shipped";

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

  const handleMarkShipped = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number.");
      return;
    }

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipping_status: "Shipped",
        tracking_number: trackingNumber.trim(),
        send_shipped_emails: true,
      }),
    });

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    router.refresh();
  };

  return (
    <div>
      {/* Update Button and Form */}
      <div className="flex justify-around gap-6 mb-6">
        <div className="w-2/5" />
        <div className="w-2/5 flex justify-end">
          <Button
            type="button"
            variant={updateForm ? "secondary" : "primary"}
            className="mt-0"
            onClick={handleUpdateForm}
          >
            {updateForm ? "Close" : "Update Customer Info"}
          </Button>
        </div>
      </div>
      {updateForm && (
        <OrderForm
          id={orderId}
          updateFormInfo={orderFormInfo}
          onClose={() => setUpdateForm(false)}
        />
      )}

      {/* Order Details */}
      <section className="flex-col mb-6">
        <div className="flex justify-around gap-6">
          {/* Order Info Section */}
          <section
            className="
            flex flex-col
            w-2/5
            rounded-xl
            border-2 border-[#55555f]
            bg-kiloblack
            overflow-hidden
            mb-6
            "
          >
            <div className="flex flex-col flex-1 px-6 py-5">
              <h2 className="text-kilored text-2xl font-bold">Order Info</h2>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-kilotextlight">
                <div>
                  <p className="font-medium text-kilotextgrey">Order ID</p>
                  <p>#{orderInfo.id}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Order Status</p>
                  <p>{orderInfo.status}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Payment Status</p>
                  <p>{orderInfo.payment_status}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Total Amount</p>
                  <p>${orderInfo.total_cents / 100}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-kilotextlight">
                <p className="font-medium text-kilotextgrey">Stripe Session ID</p>
                <p className="max-w-full break-all overflow-hidden">
                  {orderInfo.stripe_session_id}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-kilotextlight">
                <div>
                  <p className="font-medium text-kilotextgrey">Order Created</p>
                  <p>{formatDate(orderInfo.created_at)}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Last Updated</p>
                  <p>{formatDate(orderInfo.updated_at)}</p>
                </div>
              </div>
            </div>
          </section>
          {/* Order Info End */}

          {/* Customer Info Section */}
          <section
            className="
            w-2/5
            rounded-xl
            border-2 border-[#55555f]
            bg-kiloblack
            overflow-hidden
            mb-6
            "
          >
            <div className="flex flex-col flex-1 px-6 py-5">
              <h2 className="text-kilored text-2xl font-bold">Customer & Shipping Info</h2>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-kilotextlight">
                <div>
                  <p className="font-medium text-kilotextgrey">Customer Name</p>
                  <p>{orderInfo.full_name}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Email</p>
                  <p>{orderInfo.email}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Phone Number</p>
                  <p>{orderInfo.phone_number}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Address Line 1</p>
                  <p>{orderInfo.address_line_1}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Address Line 2</p>
                  <p>{orderInfo.address_line_2 || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Postal</p>
                  <p>{orderInfo.postal}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">City</p>
                  <p>{orderInfo.city}</p>
                </div>
              </div>
            </div>
          </section>
          {/* Customer Info Section End */}
        </div>

        <div className="flex justify-around gap-6">
          {/* Order Items Section */}
          <section
            className="
            w-2/5
            rounded-xl
            border-2 border-[#55555f]
            bg-kiloblack
            overflow-hidden
            mb-6
            "
          >
            <div className="px-6 py-5">
              <h2 className="text-kilored text-2xl font-bold">Order Items</h2>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {orderInfo.order_products.map((productData: any) => (
                  <div
                    key={productData.id}
                    className="
                      rounded-lg
                      border-2 border-[#55555f]
                      bg-kilodarkgrey
                      overflow-hidden
                      text-center
                    "
                  >
                    <Image
                      className="
                        w-full
                        h-48
                        object-cover
                        border-b-2 border-[#55555f]
                      "
                      src={productData.products.image_URL}
                      width={100}
                      height={100}
                      alt={productData.products.description}
                    />
                    <div className="px-3 py-3 space-y-1 text-sm text-kilotextlight">
                      <p>
                        {itemLabels[productData.products.title] ??
                          productData.products.title}
                      </p>
                      <p>
                        <span className="text-kilotextgrey">Price:</span> $
                        {productData.unit_price_cents / 100}
                      </p>
                      <p>
                        <span className="text-kilotextgrey">QTY:</span>{" "}
                        {productData.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Order Items End */}

          {/* Shipping Status Section */}
          <section
            className="
            w-2/5
            rounded-xl
            border-2 border-[#55555f]
            bg-kiloblack
            overflow-hidden
            mb-6
            "
          >
            <div className="flex flex-col flex-1 px-6 py-5">
              <h2 className="text-kilored text-2xl font-bold">Shipping Status</h2>

              <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-kilotextlight">
                <div>
                  <p className="font-medium text-kilotextgrey">Status</p>
                  <p>{orderInfo.shipping_status || "Pending"}</p>
                </div>
                <div>
                  <p className="font-medium text-kilotextgrey">Tracking Number</p>
                  <p>{orderInfo.tracking_number || "N/A"}</p>
                </div>
              </div>

              {!alreadyShipped && (
                <form onSubmit={handleMarkShipped} className="mt-6 space-y-4">
                  <AdminInput
                    label="Tracking Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number after posting"
                  />
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <Button type="submit" variant="primary" className="mt-0 w-full">
                    Mark as Shipped
                  </Button>
                </form>
              )}
            </div>
          </section>
          {/* Shipping Status End */}

        </div>
      </section>
    </div>
  );
};

export default AdminOrdersClient;
