import { headers } from "next/headers";
import type { Category } from "@/src/types/category";



const AdminCategoriesPage = async () => {

  // Get the current host so fetch works in all environments
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/categories_products`, {
    cache: "no-store", // always show fresh data in admin
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json(); 

  const categories: Category[] = data.categories_products ?? []; 


  return (
    <div>
      <h1 className="text-3xl">CATEGORIES ADMIN</h1>

      <p>
        Manage Product Categories
      </p>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <p>{category.title}</p>

              {category.description && (
                <p>{category.description} </p>
              )}
            </li>
          ))}
        </ul>
      )}


      
    </div>
  )
};

export default AdminCategoriesPage;
