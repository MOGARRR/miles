import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Category } from "@/src/types/category";
import CreateEventsForm from "./CreateEventsForm";


const AdminEventsPage = async () => {

  const baseUrl = await getBaseUrl(); 







  return (
    <div>
      <h1 className=" text-3xl">EVENTS ADMIN </h1>
      <p> 
        Manage Events
      </p>

      <br /> <br /> <br />

      <CreateEventsForm />

      <div>


        
      </div>
      
    </div>
  )
};

export default AdminEventsPage;
