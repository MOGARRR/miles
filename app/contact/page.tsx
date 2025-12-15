"use client"

const ContactPage = () => {
  return (
    <div className="">
      <div className="">
        <h1 className="text-5xl m-12 ">Contact Us</h1>
        
        <h1 className="text-xl m-12 ">
          Have any questions? <br /> Reach out and we'll be sure to get back to you as soon as we can.
        </h1>

        <fieldset className="fieldset p-4 text-xl m-12">
          <label className="label">Name*</label>
          <input type="text" className="border bg-black" />

          <label className="label">Email*</label>
          <input type="email" className="border bg-black" />

          <label className="label">Subject*</label>
          <input type="text" className="border bg-black" />

          <label className="label">Message*</label>
          <textarea className="border bg-black" placeholder=""></textarea>

          <button 
            className=" text-xl text-white btn btn-neutral btn-outline m-5 rounded-sm border-white">
            Send
          </button>
        </fieldset>
      </div>
      
    </div>
  );
};

export default ContactPage;
