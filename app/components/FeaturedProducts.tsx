import Link from "next/link";
import FeaturedProductsClient from "./FeaturedProductsClient";
import { headers } from "next/headers";
import { Product } from "@/src/types/product";
import { Category } from "@/src/types/category";


// Server Component: fetches data and renders featured products on the homepage
const FeaturedProducts = async () => {

  // Build the absolute base URL on the server.
  // Server Components cannot reliably use relative URLs ("/api/..."),
  // so we read the request headers to determine the current protocol and host
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;

  //fetch PRODUCTS from the api route
  // "no-store" ensures we always get fresh data (no caching)
  const res = await fetch(`${baseUrl}/api/products` , { cache: "no-store" });
  const data: { products: Product[] } = await res.json();

  //fetch CATEGORIES from the api route
  const categoriesRes = await fetch(`${baseUrl}/api/categories_products` , { cache: "no-store" });
  const categoriesData = await categoriesRes.json(); 

  //extract categories array (fallback to empty array)
  const categories: Category[] = categoriesData.categories_products ?? []; 

  // build category map - create a lookup object 
  // categoryId -> categoryTitle 
  // This makes it easy to get the category name for each product
  const categoryMap: Record<number, string> = {};
  categories.forEach((c) => {
    categoryMap[c.id] = c.title
    
  }); 

  // SELECT FEATURED PRODUCTS
  // available, not soldout, max=3
  const featuredProducts: Product[] = (data.products ?? [])
    .filter((p) => p.is_available && !p.sold_out)
    .slice(0, 3);

  return (

    <div className="max-w-7xl mx-auto">

      {/* HEADING */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold">Featured Drops</h2>
        <p> Limited edition artworks and exclusive pieces straight from the studio.</p>
      </div>

      {/* DISPLAY FEATURED PRODUCT CARDS */}
      <div>
        <FeaturedProductsClient
          products={featuredProducts}
          categoryMap={categoryMap}
        />      
      </div>

      {/* SEE ALL BUTTON - REDIRECTS TO STORE PAGE */}
      <div className="flex justify-center m-8">
        <Link 
          href="/store"
          className="
            inline-block
            px-4 py-2
            border
            rounded
            text-sm
            hover:underline"
        >
          See All 
        </Link>

      </div>
     
      
    </div>
  )
};

export default FeaturedProducts;
