"use client";
import { FC, useState } from "react";
import React from "react";
import { orderFormData } from "@/src/types/orderFormData";
import { useRouter } from "next/navigation";

interface OrderFormProps {
  id: string;
  updateFormInfo: orderFormData;
  onClose: () => void;
}
const OrderForm: FC<OrderFormProps> = ({ id, updateFormInfo, onClose }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: updateFormInfo.customerName || "",
    address_line_1: updateFormInfo.address1 || "",
    address_line_2: updateFormInfo.address2 || "",
    postal: updateFormInfo.postal || "",
    city: updateFormInfo.city || "",
    province: updateFormInfo.province || "",
    email: updateFormInfo.email || "",
    phone_number: updateFormInfo.phone || "",
    shipping_status: updateFormInfo.shippingStatus || "",
    tracking_number: updateFormInfo.trackingNumber || "",
    label_url: updateFormInfo.labelUrl || "",
    estimated_delivery: updateFormInfo.estimatedDelivery
      ? updateFormInfo.estimatedDelivery.split("T")[0]
      : "",
  });

  const emailHtml = `
      <h1>Order ID / Number: ${id} Updated</h1>
      <p><strong>New Order Information:</strong>
      <p>Customer Name: ${formData.full_name} </p>
      <p>Address Line 1 : ${formData.address_line_1}</p>
      <p>Address Line 2: ${formData.address_line_2}</p>
      <p>City: ${formData.city}</p>
      <p>Postal: ${formData.postal}</p>
      <p>Province: ${formData.province}</p>
      <p>Email: ${formData.email}</p>
      <p>Phone Number: ${formData.phone_number}</p>
      <p>Shipping Status: ${formData.shipping_status}</p>
      <p>Tracking Number: ${formData.tracking_number}</p>
      <p>Label URL: <a href='${formData.label_url}'>${formData.label_url}<a/></p>
      <p>Estimated Delivery: ${formData.estimated_delivery}</p>
      </p>`;

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const updateRes = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimated_delivery: formData.estimated_delivery || null,
        }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to update Order");
      }

      try {
        const emailRes = await fetch("/api/emails", {
          method: "Post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            subject: "Kiloboy Artwork Order Update",
            html: emailHtml,
          }),
        });

        if (!emailRes.ok) {
          throw new Error("Failed to send email");
        }

        onClose();

      } catch (err: any) {
        console.error("Update Email Error:", err);
      }
      console.log("Order Updated:", formData);
    } catch (err: any) {
      console.error("Update Orders Error:", err);
    }
  };

  return (
    <div className="bg-gray-800 p-5">
      <form className="flex flex-col " onSubmit={handleSubmit}>
        <h2 className="text-lg font-medium">Customer Info</h2>
        <br />
        <label>Customer Name:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Customer Name"
        />
        <br />
        <label>Address Line 1:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="address_line_1"
          value={formData.address_line_1}
          onChange={handleChange}
          placeholder="Address Line 1"
        />
        <br />
        <label>Address Line 2:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="address_line_2"
          value={formData.address_line_2}
          onChange={handleChange}
          placeholder="Address Line 2"
        />
        <br />
        <label>Postal:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="postal"
          value={formData.postal}
          onChange={handleChange}
          placeholder="Postal Code"
        />
        <br />
        <label>City:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
        />
        <br />
        <label>Province:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="province"
          value={formData.province}
          onChange={handleChange}
          placeholder="province"
        />
        <br />
        <label>Email:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <br />
        <label>Phone Number:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <br />
        <h2 className="text-lg font-medium">Shipping Info</h2>
        <br />
        <label>Shipping Status:</label>
        <select
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="shipping_status"
          id="shipping_status"
          value={formData.shipping_status}
          onChange={handleChange}
        >
          <option className="bg-gray-700" value="Pending">
            Pending
          </option>
          <option className="bg-gray-700" value="Shipped">
            Shipped
          </option>
          <option className="bg-gray-700" value="Delivered">
            Delivered
          </option>
        </select>
        <br />
        <label>Tracking Number:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="tracking_number"
          value={formData.tracking_number}
          onChange={handleChange}
          placeholder="Tracking Number"
        />
        <br />
        <label>Label URL:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          name="label_url"
          value={formData.label_url}
          onChange={handleChange}
          placeholder="Label URL"
        />
        <br />
        <label>Estimated Delivery:</label>
        <input
          className=" rounded border w-full  mt-1 p-2 text-sm"
          type="date"
          name="estimated_delivery"
          value={formData.estimated_delivery}
          onChange={handleChange}
          placeholder="Estimated Delivery Time"
        />

        <button
          className="bg-gray-400 p-2 rounded-lg w-1/4 self-center mt-5"
          type="submit"
        >
          Update Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
