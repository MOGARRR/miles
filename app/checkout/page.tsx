import React from "react";

const checkoutPage = () => {
  return (
    <div className="py-15 bg-slate-500 flex flex-col items-center">
      <div className="border-y-2 w-full mt-6 p-2">
        <h1 className="text-2xl">Your Email</h1>{" "}
        {/* Adjust input field and button to center */}
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-md">Email</legend>
          <input
            type="email"
            className="input w-5/6"
            placeholder="Email Address"
          />
          <p className="label pl-1">
            You'll receive receipts and notifications at this email
          </p>
          <button className="btn btn-wide my-2">CONTINUE</button>
        </fieldset>
      </div>
      {/* ///////////////////////// */}
      <div className="border-y-2 w-full mt-6 p-2">
        <h1 className="text-2xl">Delivery</h1>
        <h1 className="text-lg">Shipping Address</h1>
        <fieldset className="fieldset">
          {" "}
          {/* Adjust input fields to center */}
          <legend className="fieldset-legend ">First Name</legend>
          <input type="text" className="input" placeholder="First Name" />
          <legend className="fieldset-legend">Last Name</legend>
          <input type="text" className="input" placeholder="Last Name" />
          <legend className="fieldset-legend">Address</legend>
          <input type="text" className="input" placeholder="Address 1" />
          <input type="text" className="input" placeholder="Address 2" />
          <input type="text" className="input" placeholder="Postal Code" />
          <input type="text" className="input" placeholder="City" />
          <select defaultValue="Pick a color" className="select input">
            <option disabled={true}>Province</option>
            <option>AB</option>
            <option>BC</option>
            <option>NB</option>
            <option>NL</option>
            <option>NS</option>
            <option>ON</option>
            <option>PE</option>
            <option>QC</option>
            <option>SK</option>
            <option>YT</option>
            <option>NT</option>
            <option>NU</option>
          </select>
          <legend className="fieldset-legend">Phone Number</legend>
          <input type="number" className="input" placeholder="Phone Number" />
        </fieldset>
      </div>
      {/* ///////////////////////// */}
      <div className="border-y-2 w-full mt-6">
        <h1 className="text-2xl">Payment</h1>
      </div>
      {/* ///////////////////////// */}
      <div className="border-y-2 w-full mt-6 p-2 text-lg">
        <h1 className="text-2xl">Review Information</h1>
        <div>
          <h1>Email</h1>
          <p>email@email.com</p>
        </div>

        <div>
          <h1>Address</h1>
          <p>123 street NE Canada, AB, A1B 2C3</p>
        </div>
        <div>
          <h1>Phone Number</h1>
          <p>123-456-7890</p>
        </div>
      </div>
      {/* ///////////////////////// */}
      <div className="border-t-2 mt-6 p-2">
        <h1 className="text-2xl mb-6">Order Summary</h1>
        <div className="flex justify-between ">
          <div className="flex w-4/6">
            <img
              className="w-2/6 border-2"
              src="/images/Gallery-Duck-2.jpg"
              alt="img here"
            />
            <h1 className="text-lg ml-2">Duck Name</h1>
          </div>
          <div className="w-2/8">
            <h2 className="place-self-end">$9.99</h2>
            <div className="flex justify-between bg-slate-400 p-1">
              <span>Qty</span>
              <span>1</span>
            </div>
            <p className="place-self-end text-sm underline p-1">Remove</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$9.99</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
      </div>
      <div className="flex justify-between border-y-2 w-full p-2 text-lg ">
        <span>Total</span>
        <span>$9.99</span>
      </div>
    </div>
  );
};

export default checkoutPage;
