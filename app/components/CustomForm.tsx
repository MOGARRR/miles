"use client"

import { useState } from "react";
import SubmitButton from "./ui/SubmitButton";

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
    
    <section className="bg-kiloblack">

      <div className="
          max-w-[768px] mx-auto
          px-6 md:px-16 py-16
          my-16
          rounded-lg border border-[#3a3a41]
          bg-kilodarkgrey"
      >
        <h3 className="text-3xl mb-4 text-kilored">
          Request your custom piece
        </h3>
        <p className="text-base text-kilotextgrey ">
          Fill out the form below with as much detail as possible. The more specific you are, the better we can bring your idea to life.</p>
        <br />

        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset text-sm leading-[1.4]">
            <label className="text-kilotextlight font-semibold ">Name</label>
            <input 
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setStatus("idle")
              }}
              className=" 
                h-[40px]
                p-2 
                mb-2
                rounded-lg border border-[#3a3a41] 
                bg-kiloblack"
            />

            <label className="text-kilotextlight font-semibold">
              Email
            </label>
            <input 
              type="email"
              required
              placeholder="email@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setStatus("idle")
              }}
              className=" 
                h-[40px]
                p-2 
                mb-2
                rounded-lg border border-[#3a3a41] 
                bg-kiloblack"
            />
           

            <label className="text-kilotextlight font-semibold">
              Type of Request / Apparel
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. T-Shirt, Shoes, Portrait"
              value={type}
              onChange={(e) => {
                setType(e.target.value)
                setStatus("idle")
              }}
              className=" 
                h-[40px]
                p-2 
                mb-2
                rounded-lg border border-[#3a3a41] 
                bg-kiloblack"
            />

            <label className="text-kilotextlight font-semibold">
              Details 
            </label>
            <textarea
              required
              placeholder="Describe your vision in detail. Include size, colors, style preferences, inspirations, or specific elements you want included."
              value={details}
              onChange={(e) => {
                setDetails(e.target.value)
                setStatus("idle")
              }}
              className=" 
                h-[120px]
                p-2 
                mb-2
                rounded-lg border border-[#3a3a41] 
                bg-kiloblack"
            />
            
            <SubmitButton variant="primary" isLoading={isSending} loadingText="SENDING...">
              {isSending ? "SENDING..." : "SUBMIT REQUEST"}

            </SubmitButton>
 
            
          </fieldset>
        </form>
        

        <div className="mt-4 text-center">
          {status === "success" && (
            <div className="
              rounded-lg
              border border-[#3a3a41]
              bg-kiloblack
              px-4 py-3
              text-sm text-kilotextlight
            ">
              Your message was sent!
            </div>
          )}


          {status === "error" && (
            <div className="
              rounded-lg
              border border-kilored/40
              bg-kiloblack
              px-4 py-3
              text-sm text-kilored
            ">
              {errorMsg}
            </div>
          )}
        </div>

        <br/>
        
        <p className="text-sm text-kilotextgrey">We'll review your request and get back to you within 2-3 business days with a quote and timeline.</p>
        
      </div>

    </section>
    
  )
};

export default CustomForm;