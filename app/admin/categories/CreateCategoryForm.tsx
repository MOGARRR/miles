"use client"

import { useState } from "react";

const CreateCategoryForm = () => {

  // state for form fields [no image upload yet]

  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent)=> {
    e.preventDefault(); 

    console.log({title, description});

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
