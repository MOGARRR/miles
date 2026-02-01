import React from "react";
import SubmitButton from "./ui/SubmitButton";

type ShippingFormProps = {
  shippingForm: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEstimate: () => void;
  shippingEstimate: number | null;
  addressError: string | null;
};

const ShippingForm = ({
  shippingForm,
  onChange,
  onEstimate,
  shippingEstimate,
  addressError,
}: ShippingFormProps) => {
  return (
    <div
      className="
      bg-kilodarkgrey
      rounded-lg border border-[#3a3a41]
      p-8"
    >
      {/* SHIPPING INPUT */}
      {/* REFACTOR IF NECESSARY WHEN EVERYTHING IS WORKING */}
      <div className="mb-6">
        <h3 className="text-xl mb-4">Shipping Information (Within Canada)</h3>
        <p className="text-base text-kilotextgrey ">
          Add your address to calculate shipping and make sure your order
          arrives smoothly.
        </p>
      </div>

      {/* FORM */}
      <div>
        <div>
          <fieldset className="fieldset text-sm leading-[1.4]">
            <label className=" label text-kilotextlight font-semibold ">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={shippingForm.name}
              onChange={onChange}
              placeholder="Your name"
              className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack
                  "
            />

            <label className=" label text-kilotextlight font-semibold ">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={shippingForm.phoneNumber}
              onChange={onChange}
              placeholder="123-456-7890"
              className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack
                  "
            />

            <label className=" label text-kilotextlight font-semibold ">
              Postal Code
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              value={shippingForm.zip}
              maxLength={7}
              onChange={onChange}
              placeholder="e.g. M5V 2T6"
              className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack
                  "
            />

            <label className=" label text-kilotextlight font-semibold ">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={shippingForm.city}
              onChange={onChange}
              placeholder="e.g. Toronto"
              className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack
                  "
            />

            <label className=" label text-kilotextlight font-semibold ">
              Street Address
            </label>
            <input
              id="street1"
              name="street1"
              type="text"
              value={shippingForm.street1}
              onChange={onChange}
              placeholder="123 Queen St W"
              className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack
                  "
            />

            <label className=" label text-kilotextlight font-semibold ">
              Province
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={shippingForm.state}
              onChange={onChange}
              placeholder="e.g. ON"
              className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack
                  "
            />
            {addressError && (
              <p className="text-sm text-red-500 mt-2">{addressError}</p>
            )}

            <SubmitButton type="button" variant="primary" onClick={onEstimate}>
              ESTIMATE SHIPPING
            </SubmitButton>
          </fieldset>

          {/* render shipping cost on UI  */}
          {/* {shippingEstimate !== null && (
            <p className="text-base text-kilotextgrey text-center mt-6">Estimated Shipping Cost: ${shippingEstimate.toFixed(2)}</p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
