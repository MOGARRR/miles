import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Product } from "@/src/types/product";
import { Category } from "@/src/types/category";
import CreateProductForm from "./CreateProductForm";


const AdminProductsPage = async () => {

  const baseUrl = await getBaseUrl(); 

  // fetch products 
  const productsRes = await fetch(`${baseUrl}/api/products`, {
    cache: "no-store"
  }); 

  if (!productsRes.ok) {
    throw new Error("Failed to fetch products");
  }

  const productsData = await productsRes.json(); 
  const products: Product[] = productsData.products ?? []; 


  //fetch categories
  const categoriesRes = await fetch(`${baseUrl}/api/categories_products`, {
    cache: "no-store",
  }); 

  if (!categoriesRes.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categoriesData = await categoriesRes.json(); 
  const categories: Category[] = categoriesData.categories_products ?? [];

  // cretate category map to look at the title 
  const categoryMap: Record<number, string> = {}; 

  categories.forEach((category) => {
    categoryMap[category.id] = category.title
  }); 
  // console.log(categoryMap);




  return (
    <div>
      <h1 className=" text-3xl">PRODUCTS ADMIN </h1>
      <p> 
        Manage Products
      </p>

      <br /> <br /> <br />
      <CreateProductForm categories={categories}/>
      <br /> <br /> <br />

      <div>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul className="space-y-8">
            {products.map((product) => (
              <li key={product.id}>
                <p className="font-medium">{product.title}</p>

                <img 
                  src={product.image_URL}
                  alt={product.title}
                  className="w-48 h-32 object-cover rounded border mt-3 mb-3"
                />

                <p>
                  Category: {product.category_id
                    ? categoryMap[product.category_id]
                    : "Uncategorized"}
                </p>

                <p className="mt-2 text-sm">{product.description}</p>

                <p className="mt-2 text-sm">${(product.price_cents/100).toFixed(2)} </p>
                
                <p className="mt-2 text-sm">
                  Status: {product.is_available ? "Available" : "Not Available"}
                </p>

              </li>

            ))}
            
          </ul>
          
        )}
        
      </div>




      
    </div>
  )
};

export default AdminProductsPage;
