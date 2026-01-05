"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";


const CreateProductForm = () => {

  // state [ no image upload yet ]
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [priceCents, setPriceCents] = useState("");
  const [isAvailable, setIsAvailable] = useState(true); 
  const [imageUrl, setImageUrl] = useState(""); 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
                  title,
                  description,
                  priceCents,
                  imageUrl,
                  isAvailable,
                });

  }


  return (
    <div>
      <div>
        <h1>Add a New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Price (cents)</label>
          <input 
            type="number"
            value={priceCents}
            onChange={(e) => setPriceCents(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Image URL</label>
          <input 
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <input 
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          <label>Available</label>
        </div>

        <button
          type="submit"
          className="rounded border p-3 my-6 text-sm "
        >
          Create Product
        </button> 

      </form>
      
    </div>
  )
};

export default CreateProductForm;
