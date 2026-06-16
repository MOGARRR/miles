import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { formatDate } from "@/src/helpers/formatDate";
import LinkButton from "@/app/components/ui/LinkButton";

const AdminOrders = async () => {
  const baseUrl = await getBaseUrl();
  const orderRes = await fetch(`${baseUrl}/api/orders`, { cache: "no-store" });
  if (!orderRes.ok) {
    throw new Error("Failed to fetch products");
  }

  const orderData = await orderRes.json();

  return (
        // HEADING
    <div className="py-12 ">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold">ORDERS</h1>
        <p className="
          max-w-[800px] mx-auto mt-8
          text-base md:text-lg text-gray-200  text-center"
        >
          View and manage customer orders, updates, and fulfillment status.
        </p>
      </div>

      <ul
        className="
        mt-12
        grid grid-cols-4
        gap-6
        "
      >
        {orderData.orders.map((order: any) => (
          <li
            key={order.id}
            className="
              flex flex-col
              h-full
              rounded-xl
              border-2 border-[#55555f]
              bg-kiloblack
              overflow-hidden
            "
          >
            <div className="flex flex-col flex-1 px-6 py-5">
              <h2 className="text-kilored text-2xl font-bold">Order #{order.id}</h2>

              <div className="mt-4 space-y-2 text-sm text-kilotextlight">
                <p>
                  <span className="text-kilotextgrey">Customer:</span>{" "}
                  {order.full_name}
                </p>
                <p>
                  <span className="text-kilotextgrey">Total:</span> $
                  {order.total_cents / 100}
                </p>
                <p>
                  <span className="text-kilotextgrey">Status:</span>{" "}
                  {order.status}
                </p>
                <p>
                  <span className="text-kilotextgrey">Shipping:</span>{" "}
                  {order.shipping_status}
                </p>
                <p>
                  <span className="text-kilotextgrey">Order Date:</span>{" "}
                  {formatDate(order.created_at)}
                </p>
                <p>
                  <span className="text-kilotextgrey">Last Updated:</span>{" "}
                  {formatDate(order.updated_at) || "N/A"}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <LinkButton
                  href={`/admin/orders/${order.id}`}
                  variant="secondary"
                  className="block w-full mt-0"
                >
                  View Details
                </LinkButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrders;
