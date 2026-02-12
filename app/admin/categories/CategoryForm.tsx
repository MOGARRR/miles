"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import FormAlert from "@/app/components/FormAlert";
import { Category } from "@/src/types/category";

type Props = {
  category?: Category;  // present = edit mode
  onSuccess?: () => void;
};

const CategoryForm = ({ category, onSuccess }: Props) => {

  // state for form fields [no image upload yet]
  const [title, setTitle] = useState(category?.title ?? "");
  const [description, setDescription] = useState(category?.description ?? "");

  // state for loading page
  const [isLoading, setIsLoading] = useState(false);

  // state for errors 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // define if is in edit or create mode 
  const isEditMode = Boolean(category);

  useEffect(() => {
    setTitle(category?.title ?? "");
    setDescription(category?.description ?? "");
  }, [category]);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    setIsLoading(true);
    setError(null); //clear previous errors
    setSuccessMessage(null);

    // Create a new category 
    try {
      const endpoint = isEditMode
        ? `/api/categories/${category!.id}`
        : "/api/categories";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
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

      setSuccessMessage(
        isEditMode
          ? "Category updated successfully!"
          : "New category created successfully!"
      );
      setTimeout(() => {
        onSuccess?.();
      }, 1500);

      // Reset form fields only when creating, not editing 
      if (!isEditMode) {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")


      // Ensures loading state resets even if something goes wrong
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="
    w-1/4 
    bg-gray-800 
    p-4 mb-6
    rounded-md border
    ">
      <div >
        <h2 className="text-xl font-medium text-center border-b-1 mb-4 ">
          {isEditMode ? "Edit Category" : "Add New Category"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="text-center">
        <div className="my-4">
          <label className="text-md">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" 
            rounded border 
            w-full  mt-1 p-2 
            text-sm
            "
          />
        </div>

        <div>
          <label className="text-md">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
            rounded border 
            w-full 
            mt-1 p-2 
            text-sm"
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
          className="
          bg-gray-500 
          rounded border
          p-3 my-6
          text-md
          hover: cursor-pointer
          hover:bg-gray-600 
          ">
          {isLoading ? <LoadingAnimation /> : (isEditMode ? "Save Changes" : "Create Category")}
        </button>

      </form>
    </div>
  );
};

export default CategoryForm;