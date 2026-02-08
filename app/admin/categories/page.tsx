
import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import type { Category } from "@/src/types/category";
import AdminCategoriesClient from "./AdminCategoriesClient";


const AdminCategoriesPage = async () => {

  // Get the current host so fetch works in all environments
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/categories`, {
    cache: "no-store", // always show fresh data in admin
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();

  const categories: Category[] = data.categories ?? [];

  return (
    <div >
      <div>
        <h1 className="text-3xl">CATEGORIES ADMIN</h1>
        <p>
          Manage Product Categories
        </p>
      </div>


      <br /> <br /> <br />

      {/* Pass fetched categories to the client wrapper.
      The server component handles data fetching,
      while the client component owns all interactive UI state. */}
      <AdminCategoriesClient categories={categories} />

    </div>
  )
};

export default AdminCategoriesPage;
