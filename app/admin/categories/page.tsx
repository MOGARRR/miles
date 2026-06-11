
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

    // HEADING
    <div className="py-12 ">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold">CATEGORIES</h1>
        <p className="
          max-w-[800px] mx-auto mt-8
          text-base md:text-lg text-gray-200  text-center"
        >
          Create, edit, and organize categories. Keep your collection structured and manage how products are grouped and displayed.
        </p>
      </div>

      <br /> 

      {/* Pass fetched categories to the client wrapper.
      The server component handles data fetching,
      while the client component owns all interactive UI state. */}
      <AdminCategoriesClient categories={categories} />

    </div>
  )
};

export default AdminCategoriesPage;
