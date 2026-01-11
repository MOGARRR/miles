"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import { Event } from "@/src/types/event";


const CreateEventsForm = () => {

  const [isLoading, setIsLoading] = useState(false); 
  
  // state for form fields
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]  = useState("");
  const [location, setLocation] = useState(""); 
  const [hours, setHours] = useState(""); 
  const [isActive, setIsActive] = useState(false); 

  const [imageUrl, setImageUrl] = useState(""); 
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isImageValid =
    imageFile !== null ||
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("http");



  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault(); 

    console.log("Submit form");
  }; 


  
  
  return (
    <div>


      <div>
        <h1> Add New Event </h1>     
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null); // URL wins
            }}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>OR upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImageFile(e.target.files[0]);
                setImageUrl(""); // file wins
              }
            }}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        {!isImageValid && (
          <p className="text-sm text-red-600 mt-1">
            Image URL must start with "/" or "http"
          </p>
        )}

        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Hours</label>
          <input
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded border p-3 my-6 text-sm ">
          {isLoading ? <LoadingAnimation /> : "Create Event"}
          
        </button>


      </form>

    </div>
  )
};

export default CreateEventsForm;



