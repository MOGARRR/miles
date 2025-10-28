import React from "react";
import Contact from "../components/Contact";

const contactPage = () => {
  return (
    <div className="pt-15">
      <div className="bg-slate-500 p-4 border-b-2 border-slate text-center place-items-center">
        <h1 className="text-5xl m-1 border-b-2 pb-1 w-full">Contacts</h1>
        
        <h1 className="text-xl m-3 border-b-2 pb-4 ">
          Have any questions? <br /> Reach out and we'll be sure to get back to you as soon as we can.
        </h1>
        <h2 className="text-2xl mb-4">Get in touch</h2>
        <fieldset className="fieldset  rounded-box w-xs p-4 text-xl">
          <label className="label">Name*</label>
          <input type="text" className="input" />

          <label className="label">Email*</label>
          <input type="email" className="input" />

          <label className="label">Subject*</label>
          <input type="text" className="input" />

          <label className="label">Message*</label>
          <textarea className="textarea" placeholder=""></textarea>
          <button className=" text-xl text-white btn btn-neutral btn-outline m-5 rounded-sm border-white">
            Send
          </button>
        </fieldset>
      </div>
      <div className="bg-slate-400 text-center p-4 text-xl">
        <div className="">
          <h2>📞 123-456-7890</h2>
        </div>
        <div>
          <h2>📧 Duck@Season.com</h2>
        </div>
        <div>
          <h2>📫 123-DuckLane</h2>
        </div>
      </div>
    </div>
  );
};

export default contactPage;
