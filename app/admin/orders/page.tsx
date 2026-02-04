import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import Link from "next/link";
import { formatDate } from "@/src/helpers/formatDate";

const AdminOrders = async () => {
  const baseUrl = await getBaseUrl();
  const orderRes = await fetch(`${baseUrl}/api/orders`, { cache: "no-store" });
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
        <div key={order.id} className="bg-stone-800 m-5 p-5">
          <p>Order Number / ID: {order.id} </p>
          <p>Status: {order.status}</p>
          <p>Customer Name: {order.full_name}</p>
          <p>Total Amount: ${order.total_cents / 100}</p>
          <p>Shipping Status: {order.shipping_status}</p>
          <p>Order Date: {formatDate(order.created_at)}</p>
          <p>Last Updated: {formatDate(order.updated_at) || 'N/A'}</p>
          <Link  href={`/admin/orders/${order.id}`}>
          <button className="bg-gray-400 p-2 rounded-lg">View Details</button>
          </Link>
          
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
