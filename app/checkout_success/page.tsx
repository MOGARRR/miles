import { redirect } from "next/navigation";

import { stripe } from "../lib/stripe";

export default async function Success({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { session_id } = searchParams;

  if (!session_id || Array.isArray(session_id))
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["customer", "line_items", "payment_intent"],
  });

  const customerEmail = (session.customer_details as { email: string }).email;
  const lineItems = session.line_items?.data || [];

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
        <h3>Your Items:</h3>
        <ul>
          {lineItems.map((item) => (
            <li key={item.id}>
              {item.description} x {item.quantity} - {" "}
              {(item.price!.unit_amount! / 100).toFixed(2)}{" "}
              {item.price!.currency.toUpperCase()}
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
