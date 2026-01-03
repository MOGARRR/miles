import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import type { Category } from "@/src/types/category";
import CreateCategoryForm from "./CreateCategoryForm";



const AdminCategoriesPage = async () => {

  // Get the current host so fetch works in all environments
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/categories_products`, {
    cache: "no-store", // always show fresh data in admin
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();

  const categories: Category[] = data.categories_products ?? [];


  return (
    <div >
      <h1 className="text-3xl">CATEGORIES ADMIN</h1>

      <p>
        Manage Product Categories
      </p>

      <br /> <br /> <br />

      <CreateCategoryForm/>


      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className="rounded border p-4"
            >
              <p className="font-medium">{category.title}</p>

              {category.description && (
                <p className="mt-2 text-sm">{category.description} </p>
              )}
            </li>
          ))}
        </ul>
      )}



    </div>
  )
};

export default AdminCategoriesPage;
