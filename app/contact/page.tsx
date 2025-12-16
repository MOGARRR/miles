"use client"

import { useState } from "react";

const ContactPage = () => {

  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState(""); 

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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ name, email, subject, message })
      });

      // store the response 
      const data = await res.json(); 

      if (!res.ok) {
        setStatus("error"); 
        setErrorMsg(data?.error || "Something went wrong");
        return;
      }

      setStatus("success");

      // post submit cleanup 
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    
    } catch (err) {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSending(false)
    }

  };

  return (
    <div className="">
      <div className="">
        <h1 className="text-5xl m-12 ">Contact Us</h1>
        
        <h1 className="text-xl m-12 ">
          Have any questions? <br /> Reach out and we'll be sure to get back to you as soon as we can.
        </h1>

        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset p-4 text-xl m-12">

          <label className="label">Name*</label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setStatus("idle");
            }}
            className="border bg-black" />

          <label className="label">Email*</label>
          <input 
            type="email"
            required
            placeholder="email@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
            }} 
            className="border bg-black" />

          <label className="label">Subject*</label>
          <input 
            type="text" 
            required
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setStatus("idle");
            }}
            className="border bg-black" />

          <label className="label">Message*</label>
          <textarea 
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setStatus("idle");
            }}
            className="border bg-black" placeholder=""></textarea>

          <button
            type="submit"
            disabled={isSending}
            className=" text-xl text-white btn btn-neutral btn-outline m-5 rounded-sm border-white">
            {isSending ? "Sending..." : "Send"}
          </button>
        </fieldset>

        </form>

        {status === "success" && <p>Your message was sent!</p>}
        {status === "error" && <p>{errorMsg}</p>}

      </div>
      
    </div>
  );
};

export default ContactPage;
