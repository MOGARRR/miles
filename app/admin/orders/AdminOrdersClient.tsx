"use client";
import React, { useState } from "react";
import { orderData } from "@/src/types/orderData";

interface Props {
  order: orderData;
}

const AdminOrdersClient: React.FC<Props> = ({ order }) => {
  const [viewDetails, setViewDetails] = useState(false);

  const handleViewDetails = () => setViewDetails(!viewDetails);

  return (
    <div className="bg-stone-800 m-5 p-5">
      <p>Order Number / ID: {order.id} </p>
      <p>Status: {order.status}</p>
      <p>Customer Name: {order.full_name}</p>
      <p>Total Amount: {order.total_cents}</p>
      <p>Shipping Status: {order.shipping_status}</p>
      <p>Order Date: {order.created_at}</p>
      <p>Last Updated: {order.updated_at}</p>
      <button className="bg-gray-400 p-2 rounded-lg" onClick={handleViewDetails}>View Details</button>
      <br />
      <br />

      {viewDetails && (
        <div>
          <h1>Customer Info </h1>
          <p>Customer Name: {order.full_name}</p>
          <p>Email: {order.email}</p>
          <p>Phone Number: {order.phone_number}</p>
          <br />
          <h1>Order Info</h1>
          <p>Stripe_session_id: {order.stripe_session_id}</p>
          <p>Payment status: {order.payment_status}</p>
          <br />
          <h1>Shipping Info</h1>
          <p>Tracking Number: {order.tracking_number}</p>
          <p>ETA: {order.estimated_delivery}</p>
          <p>Address line 1: {order.address_line_1}</p>
          <p>Address line 2: {order.address_line_2}</p>
          <p>Postal: {order.postal}</p>
          <p>City: {order.city}</p>
          <p>Province: {order.province}</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersClient;
