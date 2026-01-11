"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import FormAlert from "@/app/components/FormAlert";

type Props = {
  onSuccess?: () => void;
};

const CreateCategoryForm = ({ onSuccess }: Props) => {

  // state for form fields [no image upload yet]
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");

  // state for loading page
  const [isLoading, setIsLoading] = useState(false);

  // state for errors 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent)=> {
    e.preventDefault(); 


    setIsLoading(true);
    setError(null); //clear previous errors
    setSuccessMessage(null); 

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

      // Notify parent (page/client wrapper) that creation succeeded
      onSuccess?.();
      
      setSuccessMessage("New category created successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

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
            required
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
          <FormAlert type="error" message={error} />
        )}

        {successMessage && (
          <FormAlert type="success" message={successMessage} />
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded border p-3 my-6 text-sm ">
          {isLoading ? <LoadingAnimation /> : "Create Category"}
        </button>

      </form>
    </div>
  );
};

export default CreateCategoryForm;
