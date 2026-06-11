import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Product } from "@/src/types/product";
import { Category } from "@/src/types/category";
import AdminProductsClient from "./AdminProductsClient";

const AdminProductsPage = async () => {
  const baseUrl = await getBaseUrl();

  // fetch products
  const productsRes = await fetch(`${baseUrl}/api/products`, {
    cache: "no-store",
  });

  if (!productsRes.ok) {
    throw new Error("Failed to fetch products");
  }

  const productsData = await productsRes.json();
  const products: Product[] = productsData.products ?? [];

  //fetch categories
  const categoriesRes = await fetch(`${baseUrl}/api/categories`, {
    cache: "no-store",
  });

  if (!categoriesRes.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categoriesData = await categoriesRes.json();
  const categories: Category[] = categoriesData.categories ?? [];

  // cretate category map to look at the title
  const categoryMap: Record<number, string> = {};

  categories.forEach((category) => {
    categoryMap[category.id] = category.title;
  });
  // console.log(categoryMap);

  return (
        // HEADING
    <div className="py-12 ">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold">PRODUCTS</h1>
        <p className="
          max-w-[800px] mx-auto mt-8
          text-base md:text-lg text-gray-200  text-center"
        >
          Create, update, and manage products in your collection.
        </p>
      </div>

      <br /> <br />
      <AdminProductsClient
        products={products}
        categories={categories}
        categoryMap={categoryMap}
      />
    </div>
  );
};

export default AdminProductsPage;
