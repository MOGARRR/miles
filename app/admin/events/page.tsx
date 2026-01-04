import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Event } from "@/src/types/event";
import CreateEventsForm from "./CreateEventsForm";
import { formatDate } from "@/src/helpers/formatDate";



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

      <CreateEventsForm />

      <div>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul className="space-y-8">
            {events.map((event) => (
              <li>

                <p className="font-medium">{event.title}</p>

                {event.description && (
                  <p className="mt-2 text-sm"> {event.description} </p>
                )}

                <p className="mt-2 text-sm">
                  📅{" "}
                  {event.start_date === event.end_date
                  ? formatDate(event.start_date)
                  : ` ${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}
                </p>

                <p className="mt-2 text-sm"> {event.hours}</p>




              </li>
              

              
            ))}
          </ul>

        )}





      </div>
      
    </div>
  )
};

export default AdminEventsPage;
