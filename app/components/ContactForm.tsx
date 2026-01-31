"use client";

import { useState } from "react";
import SubmitButton from "./ui/SubmitButton";

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
    <section className="
      "
    >   

      <div className="max-w-[768px] mx-auto
        px-6 md:px-16 py-16
        my-16 
        rounded-lg border border-[#3a3a41]
        bg-kilodarkgrey">
      
      <div className="mb-6">
        <h3 className="text-3xl mb-4 text-kilored">
          Get in touch
        </h3>

        <p className="text-base text-kilotextgrey "> 
          Have a question, idea, or just want to say hi? Fill out the form below and we'll get back to you as soon as possible.
        </p>

      </div>
        
        <div>
          <form onSubmit={handleSubmit} className="">
            <fieldset className="fieldset text-sm leading-[1.4]">
              <label className=" label text-kilotextlight font-semibold ">Name</label>
              <input 
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setStatus("idle");
                }}
                className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack"
                />

              <label className=" label text-kilotextlight font-semibold ">Email</label>
              <input 
                type="email"

                required
                placeholder="email@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }} 
                className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack" 
                />

              <label className=" label text-kilotextlight font-semibold ">Subject</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setStatus("idle");
                }}
                className=" 
                  h-[40px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack"
                />

              <label className=" label text-kilotextlight font-semibold ">Message</label>
              <textarea 
                placeholder="What's on your mind?"
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setStatus("idle");
                }}
                className=" 
                  h-[120px]
                  p-2 
                  mb-2
                  rounded-lg border border-[#3a3a41] 
                  bg-kiloblack"
              />

              <SubmitButton variant="primary" isLoading={isSending} loadingText="SENDING...">
                {isSending ? "SENDING..." : "SEND"}
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

        </div>
      </div>
        
    </section>
  );
};

export default ContactForm;