"use client"
import { useCart } from "../components/CartContext";


const cartPage = () => {
  const { items } = useCart();

  return (
    <div>
    <h1>Your Cart</h1>
    <p>Total Items: {items.length}</p>

    {items.length === 0 && <p>Your cart is empty</p>}

    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title} — ${item.price_cents / 100}
        </li>
      ))}
    </ul>
  </div>
  )
};

export default cartPage;
