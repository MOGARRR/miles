import React from 'react'

const Contact = () => {
  return (
    <div className="bg-slate-500 p-4 border-b-2 border-slate text-center place-items-center">
        <h1 className="text-5xl m-5 border-b-2 pb-4 ">Contact</h1>
        <h2 className="text-2xl mb-4">Get in touch</h2>
        <fieldset className="fieldset  rounded-box w-xs border p-4 text-xl">
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
  )
}

export default Contact