"use client";

// This component is responsible for all interactive UI related to categories.
// We render the categories list on the client because this page supports
// client-side interactions such as:
// - toggling the "Add New Category" form
// - closing the form after a successful submit
// - (future) inline edit/delete actions
//
// Keeping the list and form in the same client component avoids splitting
// interactive state across server and client boundaries and makes the UI
// easier to reason about as it grows.

import { useState, useEffect, useRef } from "react";
import type { Category } from "@/src/types/category";
import CategoryForm from "./CategoryForm";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";

type Props = {
  categories: Category[];
};

const AdminCategoriesClient = ({ categories }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isFormOpen) return;

    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [isFormOpen, editingCategory]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (categoryId: number) => {
    const confirmed = confirm(
      "Delete this category? It will be removed from any products that use it. This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleteError(null);
      setDeletingId(categoryId);

      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      router.refresh();
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col">

      {/* ADD NEW CATEGORY BUTTON  */}
      <div className="mb-20">
        <Button
          type="button"
          variant={isFormOpen ? "secondary" : "primary"}
          onClick={() => (isFormOpen ? closeForm() : setIsFormOpen(true))}
        >
          {isFormOpen ? "Cancel" : "Add New Category"}
        </Button>
      </div>

      {isFormOpen && (
        <div ref={formSectionRef} className="scroll-mt-6 mb-8">
          <CategoryForm
            category={editingCategory ?? undefined}
            onSuccess={closeForm}
            onClose={closeForm}
          />
        </div>
      )}

      {deleteError && (
        <p className="text-sm text-rose-500 mb-4">{deleteError}</p>
      )}

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul
          className="
        space-y-8 mt-6
        grid grid-cols-4
        gap-6
        "
        >
          {categories.map((category) => (
            <li
              key={category.id}
              className="
                flex flex-col
                h-full
                rounded-xl
                border-2 border-[#55555f]
                bg-kiloblack
                overflow-hidden
              "
            >
              <div className="flex flex-col flex-1 px-6 py-5">
                <h2 className="text-2xl font-bold">{category.title}</h2>

                <p
                  className="
                    mt-3
                    text-sm
                    text-kilotextgrey
                    line-clamp-3
                  "
                >
                  {category.description || "No description"}
                </p>

                <div className="mt-auto pt-6 flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 mt-0"
                    onClick={() => {
                      setEditingCategory(category);
                      setIsFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1 mt-0"
                    onClick={() => handleDelete(category.id)}
                    isLoading={deletingId === category.id}
                    loadingText="Deleting..."
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminCategoriesClient;
