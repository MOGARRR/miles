"use client"
import { useCart } from "../components/CartContext";
import { CartProduct } from "../components/CartContext";
import { useState } from "react";
import Link from "next/link";

type GroupedCartItem = CartProduct & {
  quantity: number;
};


const CartPage = () => {

  const { items, removeFromCart, addToCart } = useCart();

  // ------ SHIPPING --------
  
  const [shippingForm, setShippingForm] = useState({
    name: "",
    street1: "",
    city: "",
    state: "",
    zip: "",
    country: "CA",
  });

  const [shippingEstimate, setShippingEstimate] = useState<number | null>(null);
  const shippingAmount = shippingEstimate ?? 0;


  //store user input from the form into state
  const handleShippingChange = (event:any) => {
    const { name, value } = event.target;

    setShippingForm((prev) => ({
      ... prev, 
      [name]: value,
    }));

  }; 


  // TODO: replace with backend request to Shippo/UPS to calculate actual shipping
  const handleShippingEstimate = () => {
    console.log("Estimating shipping with:", shippingForm);

    // temporary fake value - replace with real API result later
    setShippingEstimate(12.99);
  }; 



  // ------ GROUPED ITEMS --------
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


  // ----- CALCULATE TOTALS -------
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.price_cents, 0);
  const hst = subtotalCents / 100 * 0.13;
  const total = subtotalCents / 100 + hst + shippingAmount;


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
                ${(item.price_cents / 100).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="
              px-2 py-1 border rounded
              hover:bg-gray-700"
            >
              -
            </button>

            <span>
              {item.quantity}
            </span>

            <button
              onClick={() => addToCart(item)}
              className="
              px-2 py-1 border rounded
              hover:bg-gray-700"
            >
              +
            </button>

          </li>
        ))}
      </ul>

      
      {/* SHIPPING INPUT */}
      {/* REFACTOR IF NECESSARY WHEN EVERYTHING IS WORKING */}
      <h1 className="text-xl">Shipping (Within Canada) </h1>
      {items.length > 0 && (
        <div>

          <label>Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={shippingForm.name}
            onChange={handleShippingChange}
            placeholder="Your name"
            className="m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />

          <br />


          <label>Postal Code</label>
          <input 
            id="zip"
            name="zip"
            type="text"
            value={shippingForm.zip}
            onChange={handleShippingChange}
            placeholder="e.g. M5V 2T6"
            className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />

          <br />

          <label>City</label>
          <input 
            id="city"
            name="city"
            type="text"
            value={shippingForm.city}
            onChange={handleShippingChange}
            placeholder="e.g. Toronto"
            className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />

          <br />

          <label>Street Address</label>
          <input
            id="street1"
            name="street1"
            type="text"
            value={shippingForm.street1}
            onChange={handleShippingChange}
            placeholder="123 Queen St W"
            className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600"
          />

          <br />

          <label>State / Province</label>
          <input 
            id="state"
            name="state"
            type="text"
            value={shippingForm.state}
            onChange={handleShippingChange}
            placeholder="e.g. ON"
            className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />

          <br/>

          <button
            className=" rounded border p-2 cursor-pointer"
            onClick={handleShippingEstimate}>
            Estimate Shipping

          </button>

          <br/> <br/>

          {/* render shipping cost on UI  */}
          {shippingEstimate !== null && (
            <p>Estimated Shipping Cost: ${shippingEstimate.toFixed(2)}</p>
          )}
        </div>
      )}

      <br /><br />

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

          {shippingEstimate !== null && (
            <div>
              Shipping: $
              {shippingAmount.toFixed(2)}
            </div>
          )}


          <div className="font-semibold text-xl">
            Total: $
            {total.toFixed(2)}
          </div>
        </div>

      )}
      <br /><br />
      
      <Link 
        href="/store"
        aria-label="Back to Gallery"
        className=" rounded border p-2 cursor-pointer"
      > Continue Shopping </Link>

      <br /><br />

      {/* TODO: redirect to stripe    */}
      <button className="rounded border p-2 cursor-pointer">
        Proceed To Checkout
      </button>
      <br /><br /><br /><br />
    </div>
  )
};

export default CartPage;
