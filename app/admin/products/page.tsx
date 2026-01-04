
import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Product } from "@/src/types/product";
import CreateProductForm from "./CreateProductForm";
import { formatDate } from "@/src/helpers/formatDate";



const AdminProductsPage = () => {


  return (
    <div>
      <h1 className=" text-3xl">PRODUCTS ADMIN </h1>
      <p> 
        Manage Products
      </p>

      <br /> <br /> <br />
      <CreateProductForm />
      <br /> <br /> <br />




      
    </div>
  )
};

export default AdminProductsPage;
