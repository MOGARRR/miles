"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";

const CreateCategoryForm = () => {

  // state for form fields [no image upload yet]
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");

  // state for loading page
  const [isLoading, setIsLoading] = useState(false);

  // state for errors 
  const [error, setError] = useState<string | null>(null);

  const isTitleEmpty = title.trim() === "";

  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent)=> {
    e.preventDefault(); 

    if (isTitleEmpty) return;

    setIsLoading(true);
    setError(null); //clear previous errors

    // Create a new category 
    try {
      const res = await fetch("/api/categories_products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create category");

      }

      // Trigger a re-render of the Server Component 
      router.refresh();

      // Reset form fields
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Something went wrong. Please try again.")


      // Ensures loading state resets even if something goes wrong
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <div>
        Add New Category
      </div>

    
      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-sm">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>
          
        <div>
          <label className="text-sm">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || isTitleEmpty}
          className="rounded border p-3 my-6 text-sm ">
          {isLoading ? <LoadingAnimation /> : "Create Category"}
        </button>

      </form>
    </div>
  );
};

export default CreateCategoryForm;
