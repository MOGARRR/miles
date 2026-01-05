
import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Product } from "@/src/types/product";
import CreateProductForm from "./CreateProductForm";
// import { formatDate } from "@/src/helpers/formatDate";



const AdminProductsPage = async () => {

  const baseUrl = await getBaseUrl(); 

  const res = await fetch(`${baseUrl}/api/products`, {
    cache: "no-store"
  }); 

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json(); 

  const products: Product[] = data.products ?? []; 


  return (
    <div>
      <h1 className=" text-3xl">PRODUCTS ADMIN </h1>
      <p> 
        Manage Products
      </p>

      <br /> <br /> <br />
      <CreateProductForm />
      <br /> <br /> <br />

      <div>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul className="space-y-8">
            {products.map((product) => (
              <li>
                <p className="font-medium">{product.title}</p>

                <img 
                  src={product.image_URL}
                  alt={product.title}
                  className="w-48 h-32 object-cover rounded border mt-3 mb-3"
                />

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
