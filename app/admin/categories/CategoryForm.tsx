"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import FormAlert from "@/app/components/FormAlert";
import AdminForm from "@/app/components/ui/AdminForm";
import AdminFormSection from "@/app/components/ui/AdminFormSection";
import AdminInput from "@/app/components/ui/AdminInput";
import AdminTextarea from "@/app/components/ui/AdminTextArea";

import Button from "@/app/components/ui/Button";
import { Category } from "@/src/types/category";

type Props = {
  category?: Category; // present = edit mode
  onSuccess?: () => void;
  onClose?: () => void;
};

const CategoryForm = ({ category, onSuccess, onClose }: Props) => {
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
          : "New category created successfully!",
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
      setError("Something went wrong. Please try again.");

      // Ensures loading state resets even if something goes wrong
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <AdminForm
      title={isEditMode ? "Edit Category" : "Create Category"}
      description="Manage product categories"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <fieldset className="space-y-6">

          {/* BASIC INFO */}
          <AdminFormSection title="Category Info">
            <AdminInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={12}
              placeholder="Marvel, Sports, etc."
            />

            {/* DESCRIPTION */}
            <AdminTextarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />

          </AdminFormSection>


          {/* SUCCESS AND ERROR MESSAGES */}
          {error && <FormAlert type="error" message={error} />}
          {successMessage && (
            <FormAlert type="success" message={successMessage} />
          )}

          {/* SUBMIT BUTTON  */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText={isEditMode ? "Saving..." : "Creating..."}
            >
              {isEditMode ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </fieldset>
      </form>
    </AdminForm>
  );
};

export default CategoryForm;
