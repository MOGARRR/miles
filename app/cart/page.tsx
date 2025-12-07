"use client"
import { useCart } from "../components/CartContext";
import { CartProduct } from "../components/CartContext";

type GroupedCartItem = CartProduct & {
  quantity: number;
};


const CartPage = () => {
  
  const { items, removeFromCart } = useCart();

  const groupedItems: GroupedCartItem[] = [];

  for (const item of items) {
    const existing = groupedItems.find(
      (groupedItem) => groupedItem.id === item.id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      groupedItems.push({
        ...item,
        quantity: 1,
      });
    }
  };



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
      {groupedItems.map((item) => (
        

        <li key={item.id} className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <img 
          src={item.image_URL}
          alt={item.title}
          className="w-20 h-20 object-cover rounded-md"
          />

          

          <div className="flex flex-col flex-1">
            <span className="font-semibold">{item.title}</span>
            <span className="text-gray-300 text-sm">
              Qty: {item.quantity}
            </span>
            <span className="text-gray-300 text-sm">
              ${(item.price_cents / 100).toFixed(2)}
            </span>
          </div>

          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-red-400 hover:text-red-300 underline"
          >
            Remove 1 
          </button>



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
