"use client"

import React from "react";

const CustomArtworkForm = () => {


  const handleSubmit = async () => {

  }


  return (
   
    <div className="p-4 text-xl m-12">
      <h2>Request your custom piece</h2>
      <p>Fill out the form below with as much detail as possible. The more specific you are, the better we can bring your idea to life.</p>
      <br />

      <form>
        <fieldset className="fieldset ">
          <label> Name</label>
          <input 
            type="text"
            required
            placeholder="Your Name"
            className="border p-2 bg-black"
          />

          <label> Email</label>
          <input 
            type="text"
            required
            placeholder="Your E-mail"
            className="border p-2 bg-black"
          />

          <label> Type of Request / Apparel</label>
          <input 
            type="text"
            required
            placeholder="e.g. T-Shirt, Nike Shoes, Portrait"
            className="border p-2 bg-black"
          />

          <label> Specifications</label>
          <input 
            type="text"
            required
            placeholder="e.g. Size, Colors, Style Preferences"
            className="border p-2 bg-black"
          />

          <label> Details </label>
          <textarea
            required
            placeholder="Describe your vision in detail. Include references, inspirations, or specific elements you want included."
            className="border p-2 bg-black"
          />

          <button>
            Submit Request
          </button>
          
        </fieldset>
      </form>
      <p className="text-sm ">We'll review your request and get back to you within 2-3 business days with a quote and timeline.</p>
    </div>
    
  
  )
};

export default CustomArtworkForm;
