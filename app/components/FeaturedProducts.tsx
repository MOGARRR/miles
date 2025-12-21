import Link from "next/link";
import ProductListItem from "./ProductListItem";
import { headers } from "next/headers";


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
  const data = await res.json();

  //fetch CATEGORIES from the api route
  const categoriesRes = await fetch(`${baseUrl}/api/categories_products` , { cache: "no-store" });
  const categoriesData = await categoriesRes.json(); 

  //extract categories array (fallback to empty array)
  const categories = categoriesData.categories_products ?? []; 

  // build category map - create a lookup object 
  // categoryId -> categoryTitle 
  // This makes it easy to get the category name for each product
  const categoryMap: Record<number, string> = {};
  categories.forEach((c: any) => {
    categoryMap[c.id] = c.title
    
  }); 


  // SELECT FEATURED PRODUCTS
  // available, not soldout, max=3
  const featuredProducts = (data.products ?? [])
    .filter((p: any) => p.is_available && !p.sold_out)
    .slice(0, 3);


  return (
    <div>

      {/* HEADING */}
      <div>
        <h2 className="text-2xl font-semibold">Featured Drops</h2>
        <p> Limited edition artworks and exclusive pieces straight from the studio.</p>
      </div>

      {/* DISPLAY FEATURED PRODUC CARDS */}
      <div>
        {featuredProducts.map((product: any) => {
          // Get the category name using the category map (if category exists)
          const categoryName = 
             product.category_id !== null ? categoryMap[product.category_id] : undefined;
          return (
            <ProductListItem 
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            category_id={product.category_id}
            category_name={categoryName}
            image_URL={product.image_URL}
            price_cents={product.price_cents}
            sold_out={product.sold_out}
            is_available={product.is_available}
            created_at={product.created_at}
            updated_at={product.updated_at}
          />
          )
        })}

      </div>

      {/* SEE ALL BUTTON - REDIRECTS TO STORE PAGE */}
      <div>
        <Link href="/store">
          Shop 
        </Link>

      </div>
     
      
    </div>
  )
};

export default FeaturedProducts;
