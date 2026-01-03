"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateCategoryForm = () => {

  // state for form fields [no image upload yet]
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");

  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent)=> {
    e.preventDefault(); 

    // Create a new category 
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

  }


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
        className="rounded border p-3 my-6 text-sm">
        Create Category
      </button>

    </form>
  );
};

export default CreateCategoryForm;
