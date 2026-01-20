// "use client";
import { getBaseUrl } from "@/src/helpers/getBaseUrl";

const AdminOrders = async () => {
  const baseUrl = await getBaseUrl();
  const orderRes = await fetch(`${baseUrl}/api/orders`, {
    cache: "no-store",
  });

  if (!orderRes.ok) {
    throw new Error("Failed to fetch products");
  }

  const orderData = await orderRes.json();

  return (
    <div>
      <div>
        <h1 className="text-3xl">ORDERS ADMIN</h1>
        <p>Manage Orders</p>
      </div>
      <br />
      {orderData.orders.map((order: any) => (
        <div className="bg-stone-800 m-5 p-5" key={order.id}>
          <div>
            <h1>Order ID: {order.id}</h1>
            <p>Status: {order.status}</p>
          </div>
          <br />
          <div className="flex flex-col">
            <div className="">
              <h1>Customer Info:</h1>
              <p>Full name: {order.full_name}</p>
              <p>Email: {order.email}</p>
              <p>Phone Number: {order.phone_number}</p>
            </div>
            <br />

            <div className="">
              <h1>Payment Info:</h1>
              <p>Stripe_session_id: {order.stripe_session_id}</p>
              <p>Payment status: {order.payment_status}</p>
              <p>Total_cents: ${order.total_cents / 100}</p>
            </div>
          </div>
          <br />

          <div className="">
            <h1>Shipping Info:</h1>
            <p>Shipping Status: {order.shipping_status}</p>
            <p>Tracking Number: {order.tracking_number}</p>
            <p>ETA: {order.estimated_delivery}</p>
            <p>Address line 1: {order.address_line_1}</p>
            <p>Address line 2: {order.address_line_2}</p>
            <p>Postal: {order.postal}</p>
            <p>City: {order.city}</p>
            <p>Province: {order.province}</p>
          </div>
          <br />
          <div>
            <p>Order Created: {order.created_at}</p>
            <p>Last Updated: {order.updated_at}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
