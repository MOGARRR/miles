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
      <div className="text-center">
        <h1 className="text-3xl border-b-1">ORDERS ADMIN</h1>
        <p>Manage Orders</p>
      </div>
      <br /> <br />
      <ul
        className="
        space-y-8 mt-6 
        grid grid-cols-4
        gap-6 
        "
      >
        {orderData.orders.map((order: any) => (
          <li
            key={order.id}
            className=" 
            flex flex-col justify-around items-center
            rounded-xl border
            bg-gray-800
            p-4"
          >
            <h2 className="text-2xl text-kilored border-b-1 mb-2">
              Order ID: #{order.id}{" "}
            </h2>
            <div className="flex flex-col text-center text-sm">
              <section className="text-lg">
                <div>
                  <h2>Customer Name:</h2>
                  <p>{order.full_name}</p>
                </div>
              </section>

              <section className="flex justify-around my-2 text-">
                <div>
                  <h2>Total Amount:</h2>
                  <p>${order.total_cents / 100}</p>
                </div>
                <div>
                  <h2>Status:</h2>
                  <p>{order.status}</p>
                </div>
                <div>
                  <h2>Shipping Status:</h2>
                  <p>{order.shipping_status}</p>
                </div>
              </section>

              <section className="flex justify-evenly">
                <div>
                  <h2>Order Date:</h2>
                  <p className="text-sm mr-1">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <h2>Last Updated:</h2>
                  <p className="text-sm ml-1">
                    {formatDate(order.updated_at) || "N/A"}
                  </p>
                </div>
              </section>
            </div>

            <Link href={`/admin/orders/${order.id}`}>
              <button
                className="
                  mt-3 text-md  
                  bg-gray-500 
                  p-2 
                  rounded-full border
                  cursor-pointer
                  hover:bg-gray-600"
              >
                View Details
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrders;
