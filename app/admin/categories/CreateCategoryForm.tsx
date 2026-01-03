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

  const isTitleEmpty = title.trim() === "";

  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent)=> {
    e.preventDefault(); 

    if (isTitleEmpty) return;

    setIsLoading(true);

    // Create a new category 
    try {
      await fetch("/api/categories_products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      // Trigger a re-render of the Server Component 
      router.refresh();

      // Reset form fields
      setTitle("");
      setDescription("");

      // Ensures loading state resets even if something goes wrong
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="text-sm">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=" rounded border w-full  mt-1 p-2 text-sm"
        />
      </div>
        
      <div>
        <label className="text-sm">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className=" rounded border w-full  mt-1 p-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isTitleEmpty}
        className="rounded border p-3 my-6 text-sm ">
        {isLoading ? <LoadingAnimation /> : "Create Category"}
      </button>

    </form>
  );
};

export default CreateCategoryForm;
