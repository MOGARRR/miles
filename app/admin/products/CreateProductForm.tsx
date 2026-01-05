"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import { Category } from "@/src/types/category";

type Props = {
  categories: Category[];
};


const CreateProductForm = ({ categories }: Props) => {

  // state for form fields [ no image upload yet ]
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true); 
  const [imageUrl, setImageUrl] = useState(""); 

  // state for loading page
  const [isLoading, setIsLoading] = useState(false);

  // state for errors 
  const [error, setError] = useState<string | null>(null);

  const isTitleEmpty = title.trim() === "";
  const isPriceInvalid = Number(price) <= 0;

  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTitleEmpty) return;

    setIsLoading(true);
    setError(null); //clear previous errors

    //create a new product
    try {
      const res = await fetch ("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          price_cents: Math.round(Number(price) * 100),
          image_URL: imageUrl, 
          is_available: isAvailable
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");

      }
    

      // Trigger a re-render of the Server Component 
      router.refresh();

      // reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setIsAvailable(true);


    } catch (err) {
      setError("Something went wrong. Please try again.")

    } finally {
      setIsLoading(false);
    }
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
          <label>Price</label>
          <input 
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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

        {error && (
          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || isTitleEmpty || isPriceInvalid}
          className="rounded border p-3 my-6 text-sm "
        >
          {isLoading ? <LoadingAnimation /> : "Create Product"}
        </button> 

      </form>
      
    </div>
  )
};

export default CreateProductForm;
