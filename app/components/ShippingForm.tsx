import React from "react";

type ShippingFormProps = {
  shippingForm: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEstimate: () => void;
  shippingEstimate: number | null;
};


const ShippingForm = ({
  shippingForm,
  onChange,
  onEstimate,
  shippingEstimate,
}: ShippingFormProps) => {

  return (
    <div className="border border-kilored">
      {/* SHIPPING INPUT */}
      {/* REFACTOR IF NECESSARY WHEN EVERYTHING IS WORKING */}
      <h1 className="text-xl">Shipping (Within Canada) </h1>

        <div>
          <div>
            <label>Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={shippingForm.name}
              onChange={onChange}
              placeholder="Your name"
              className="m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
            />
            <br />
            <label>Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={shippingForm.phoneNumber}
              onChange={onChange}
              placeholder="Format: 123-456-7890"
              className="m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
            />
            <br />
            <label>Postal Code</label>
            <input
              id="zip"
              name="zip"
              type="text"
              value={shippingForm.zip}
              maxLength={7}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              placeholder="e.g. ON"
              className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
            />
            <br />
            <button
              className=" rounded border p-2 cursor-pointer"
              onClick={onEstimate}
            >
              Estimate Shipping
            </button>
            <br /> <br />

            {/* render shipping cost on UI  */}
            {shippingEstimate !== null && (
              <p>Estimated Shipping Cost: ${shippingEstimate.toFixed(2)}</p>
            )}
          </div>

        </div>
             
    </div>
  )
};

export default ShippingForm;
