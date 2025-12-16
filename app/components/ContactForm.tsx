"use client";

import { useState } from "react";

const ContactForm = () => {
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
    <>
    <form onSubmit={handleSubmit}>
          <fieldset className="fieldset p-4 m-12">

          <label className="label">Name*</label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setStatus("idle");
            }}
            className="border bg-black p-2" />

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
            className="border bg-black p-2" />

          <label className="label">Subject*</label>
          <input 
            type="text" 
            required
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setStatus("idle");
            }}
            className="border bg-black p-2" />

          <label className="label">Message*</label>
          <textarea 
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setStatus("idle");
            }}
            className="border bg-black"
          />

          <button
            type="submit"
            disabled={isSending}
            className=" text-white btn btn-outline m-5 rounded-sm border-white">
            {isSending ? "Sending..." : "Send"}
          </button>
        </fieldset>

        </form>
        
        <div>
          {status === "success" && <p>Your message was sent!</p>}
          {status === "error" && <p>{errorMsg}</p>}

        </div>
        
      </>
    
  );
};

export default ContactForm;