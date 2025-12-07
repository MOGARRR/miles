"use client"
import { useCart } from "../components/CartContext";



const CartPage = () => {
  
  const { items } = useCart();

  const subtotalCents = items.reduce (
    (sum, item) => sum + item.price_cents, 0 );

  const hst = subtotalCents / 100 * 0.13;

  const total = subtotalCents / 100 + hst;

  return (
    <div className="pt-24 px-6">
    <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
    <p>Total Items: {items.length}</p>

    {items.length === 0 && <p>Your cart is empty! </p>}

    {/* LIST OF ITEMS  */}
    <ul className="space-y-4 mt-4">
      {items.map((item) => (
        

        <li key={item.id}>
          <img 
          src={item.image_URL}
          alt={item.title}
          className="w-20 h-20 object-cover rounded-md"
          />

          <div className="flex flex-col">
            <span className="font-semibold">{item.title}</span>
            <span className="text-gray-300 text-sm">
              ${(item.price_cents / 100).toFixed(2)}
            </span>
          </div>
        </li>
      ))}
    </ul>
    
    {/* SUBTOTAL */}
    {items.length > 0 && (
      <div>
        <div>
          Subtotal: $
          {(subtotalCents / 100).toFixed(2)}
        </div>

        <div>
          HST (13%): $
          {hst.toFixed(2)}
        </div>

        <div className="font-semibold text-xl">
          Total: $
          {total.toFixed(2)}
        </div>
      </div>

      
    )}
  </div>
  )
};

export default CartPage;
