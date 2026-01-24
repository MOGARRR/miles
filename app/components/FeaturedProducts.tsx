import Link from "next/link";
import FeaturedProductsClient from "./FeaturedProductsClient";
import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { headers } from "next/headers";
import { Product } from "@/src/types/product";
import { Category } from "@/src/types/category";


// Server Component: fetches data and renders featured products on the homepage
const FeaturedProducts = async () => {

  const baseUrl = await getBaseUrl();

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


  //fetch PRODUCTS from the api route
  // "no-store" ensures we always get fresh data (no caching)
  const res = await fetch(`${baseUrl}/api/products` , { cache: "no-store" });
  const data: { products: Product[] } = await res.json();

  // SELECT FEATURED PRODUCTS
  // available, not soldout, max=3
  const featuredProducts: Product[] = (data.products ?? [])
    .filter((p) => p.is_available && !p.sold_out)
    .slice(0, 3);
   
  return (

    <section>

      {/* CONTENT SECTION */}
      <div className="
        max-w-7xl mx-auto
        px-6 md:px-16
      ">
        {/* HEADING */}
        <div className="pt-20 pb-16">
          <h1 className="
            text-3xl md:text-5xl leading-tight
            font-bold"
          >
            Featured Drops
          </h1>

          <p className="
            text-base md:text-xl
            text-kilotextgrey
            pt-6"
          > 
            Limited edition artworks and exclusive pieces straight from the studio.
          </p>
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

      
     
      
    </section>
  )
};

export default FeaturedProducts;
