"use client"

import { useState } from "react";

const CustomForm = () => {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState(""); 

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSending(true); 
    setStatus("idle"); 
    setErrorMsg("");

    try {
      // send post request with form info 
      const res = await fetch("/api/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, details})
      })

      const data = await res.json(); 

      if (!res.ok) {
        setStatus("error")
        setErrorMsg(data?.error || "Something went wrong")
        return;
      }

      setStatus("success"); 

      //post submit cleanup
      setName("");
      setEmail("");
      setType(""); 
      setDetails("");

    } catch (err) {
      setStatus("error")
      console.error(err)
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
   
    <div className="p-4 m-12">
      <h2 className="text-4xl mb-4">Request your custom piece</h2>
      <p>Fill out the form below with as much detail as possible. The more specific you are, the better we can bring your idea to life.</p>
      <br />

      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset ">
          <label>Name</label>
          <input 
            type="text"
            required
            placeholder="Your Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setStatus("idle")
            }}
            className="border p-2 bg-black"
          />

          <label>Email</label>
          <input 
            type="email"
            required
            placeholder="Your E-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setStatus("idle")
            }}
            className="border p-2 bg-black"
          />

          <label>Type of Request / Apparel</label>
          <input 
            type="text"
            required
            placeholder="e.g. T-Shirt, Shoes, Portrait"
            value={type}
            onChange={(e) => {
              setType(e.target.value)
              setStatus("idle")
            }}
            className="border p-2 bg-black"
          />

          <label>Details </label>
          <textarea
            required
            placeholder="Describe your vision in detail. Include size, colors, style preferences, inspirations, or specific elements you want included."
            value={details}
            onChange={(e) => {
              setDetails(e.target.value)
              setStatus("idle")
            }}
            className="border p-2 bg-black"
          />

          <button 
            type="submit"
            disabled={isSending}
            className=" text-white btn btn-outline m-5 rounded-sm border-white"

            >
            {isSending ? "Sending..." : "Submit request"}
          </button>
          
        </fieldset>
      </form>
      <div>
        {status === "success" && <p>Your message was sent!</p>}
        {status === "error" && <p>{errorMsg}</p>}
      </div>

      <br/>
      
      <p className="text-sm ">We'll review your request and get back to you within 2-3 business days with a quote and timeline.</p>
      
    </div>
  )
};

export default CustomForm;