// "use client";
import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import AdminOrdersClient from "./AdminOrdersClient";

const AdminOrders = async () => {
  const baseUrl = await getBaseUrl();
  const orderRes = await fetch(`${baseUrl}/api/orders`, {cache: "no-store",});

  if (!orderRes.ok) {throw new Error("Failed to fetch products");}
  
  const orderData = await orderRes.json();

  return (
    <div>
      <div>
        <h1 className="text-3xl">ORDERS ADMIN</h1>
        <p>Manage Orders</p>
      </div>
      <br />
      {/* <pre>{JSON.stringify(orderData.orders, null, 2)}</pre> */}
      {orderData.orders.map((order: any) => (
        <AdminOrdersClient key={order.id} order={order}/>
      ))}
    </div>
  );
};

export default AdminOrders;