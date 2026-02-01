import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Event } from "@/src/types/event";
import AdminEventsClient from "./AdminEventsClient";


const AdminEventsPage = async () => {

  const baseUrl = await getBaseUrl(); 

  const res = await fetch(`${baseUrl}/api/events`, {
    cache: "no-store"
  }); 

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await res.json(); 
  const events: Event[] = data.events ?? [];

  return (
    <div>
      <h1 className=" text-3xl">EVENTS ADMIN </h1>
      <p> 
        Manage Events
      </p>

      <br /> <br /> <br />

      <AdminEventsClient events={events} />      
     
    </div>
  )
};

export default AdminEventsPage;
