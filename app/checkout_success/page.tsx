import { redirect } from "next/navigation";

import { stripe } from "../lib/stripe";

export default async function Success({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { session_id } = await searchParams;

  if (!session_id || Array.isArray(session_id))
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["customer", "line_items", "payment_intent"],
  });

  const customerEmail = (session.customer_details as { email: string }).email;
  const lineItems = session.line_items?.data || [];

  const totalAmount =
  (session.amount_total ?? 0) / 100;

  console.log("LINE ITEMS" , lineItems);

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    return (
      <section id="success" >

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
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-20 space-y-8">
          {/* ITEMS CARD */}
          <div className="rounded-lg border border-[#3a3a41] bg-kilodarkgrey p-8">
            <h2 className="text-3xl mb-6 text-kilored"> ORDER #</h2>
            <h3 className="text-xl mb-6">Your items</h3>

            <ul className="space-y-4">
              {lineItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-700 pb-4"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-kilotextgrey">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-lg font-semibold">
                    ${(item.price!.unit_amount! / 100).toFixed(2)}{" "}
                    
                  </p>
                </li>
              ))}
              {/* TOTAL */}
              <li className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold text-kilored">
                  ${totalAmount.toFixed(2)}
                </span>
              </li>
            </ul>
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
                href="mailto:orders@example.com"
                className="text-kilored underline hover:opacity-80"
              >
                orders@example.com
              </a>
              .
            </p>
          </div>
        </div>
        
      </section>
    );
  }
}
