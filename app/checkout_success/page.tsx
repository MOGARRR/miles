import { redirect } from "next/navigation";

import { stripe } from "../lib/stripe";
import { formatProductSizeLabel } from "@/src/helpers/formatProductSizeLabel";

import { getOrderByStripeSessionId, getOrderWithProducts } from "@/src/controllers/orderControllers";

import LinkButton from "../components/ui/LinkButton";

/** Stripe line description → product title + optional size (inches via formatter). */
function lineItemMainAndSize(description: string | null | undefined): {
  main: string;
  size: string | null;
} {
  if (!description) return { main: "", size: null };
  if (description === "HST (13%)" || description === "Shipping") {
    return { main: description, size: null };
  }
  const m = description.match(/^(.*) \(([^)]+)\)\s*$/);
  if (!m) return { main: description, size: null };
  return {
    main: m[1].trim(),
    size: formatProductSizeLabel(m[2].trim()),
  };
}

export default async function Success({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { session_id } = await searchParams;

  if (!session_id || Array.isArray(session_id)) {
    return redirect("/");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["customer", "line_items", "payment_intent"],
  });

  const order = await getOrderByStripeSessionId(session.id);

  const orderWithProducts = order ? await getOrderWithProducts(order.id) : null;

  const imageByTitle = new Map<string, string>(
    (orderWithProducts?.order_products ?? []).map((op: any) => [
      op.products?.title as string,
      op.products?.image_URL as string,
    ])
  );

  const customerEmail = session.customer_details?.email ?? "your email";
  const lineItems = session.line_items?.data || [];

  const totalAmount = (session.amount_total ?? 0) / 100;

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "expired") {
    return (
      <section className="bg-kilodarkgrey py-24 text-center">
        <h1 className="text-3xl text-kilored mb-4">This checkout session has expired</h1>
        <p className="text-kilotextgrey">Please return to the store and try again.</p>
        <LinkButton href="/store" variant="secondary" className="mt-8">
          BACK TO GALLERY
        </LinkButton>
      </section>
    );
  }

  if (session.status === "complete") {
    return (
      <section id="success"  >

        <div className="bg-kilodarkgrey py-24">
          
          {/* HERO */}
          <div className="
            max-w-7xl mx-auto
            px-6 md:px-16 
            text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-kilored">Thank you!</h1>         
            <p className="text-base md:text-lg text-gray-200 max-w-[800px] mx-auto mt-8"> 
              Your order has been successfully placed, and we're getting everything ready on our end. <br/>A confirmation email with your order details has been sent to {" "}
              {customerEmail}.
            </p>
          </div>
        </div>

       
        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6 md:px-16 py-20 space-y-8">
          {/* ITEMS CARD */}
          <div className="rounded-lg border border-[#3a3a41] bg-kilodarkgrey p-8">
            <h2 className="text-3xl mb-6 text-kilored"> ORDER #{order?.id}</h2>
            <h3 className="text-xl mb-6">Your items</h3>

            <ul className="space-y-4">
              {lineItems.map((item) => {
                const { main, size } = lineItemMainAndSize(item.description);
                const imageUrl = imageByTitle.get(main);

                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-4 border-b border-gray-700 pb-4"
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={main}
                        className="w-16 h-16 shrink-0 object-cover rounded-lg ring-1 ring-[#3a3a41]/50"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{main}</p>
                      {size && (
                        <p className="text-sm text-kilotextgrey mt-0.5">Size: {size}</p>
                      )}
                      <p className="text-sm text-kilotextgrey mt-0.5">Qty: {item.quantity}</p>
                    </div>

                    <p className="text-lg font-semibold shrink-0 tabular-nums">
                      ${(item.price!.unit_amount! / 100).toFixed(2)}
                    </p>
                  </li>
                );
              })}

              
              {/* TOTAL */}
              <li className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold text-kilored">
                  ${totalAmount.toFixed(2)}
                </span>
              </li>
            </ul>
          </div>

          {/* SHIPPING CARD */}
          <div className="rounded-lg border border-[#3a3a41] bg-kilodarkgrey p-8">
            <h3 className="text-xl mb-4">Shipping to</h3>

            <p className="text-kilotextgrey mb-1">{order?.full_name}</p>
            <p className="text-kilotextgrey mb-1">
              {order?.address_line_1}
              {order?.address_line_2 ? `, ${order.address_line_2}` : ""}
            </p>
            <p className="text-kilotextgrey">
              {order?.city}, {order?.province} {order?.postal}
            </p>
          </div>

          

          {/* NEXT STEPS CARD */}
          <div className="rounded-lg border border-[#3a3a41] bg-kilodarkgrey p-8">
            <h3 className="text-xl mb-4">What happens next</h3>
            <p className="text-kilotextgrey max-w-3xl">
              Your artwork is being carefully prepared.
              <br />
              If your order includes a physical piece, you'll receive another
              email with shipping and tracking details once it ships.
              <br />
              For digital items, access details will be sent shortly.
            </p>
          </div>

          {/* SUPPORT CARD */}
          <div className="rounded-lg border border-[#3a3a41] bg-kilodarkgrey p-8">
            <h3 className="text-xl mb-4">Need help?</h3>
            <p className="text-kilotextgrey">
              If you have any questions about your order, contact us at{" "}
              <a
                href="mailto:kiloboyartwork@hotmail.com"
                className="text-kilored underline hover:opacity-80"
              >
                kiloboyartwork@hotmail.com
              </a>
              .
            </p>
          </div>
        </div>
        
      </section>
    );
  }
}
