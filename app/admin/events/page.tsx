import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Event } from "@/src/types/event";
import CreateEventsForm from "./CreateEventsForm";
import { formatDate } from "@/src/helpers/formatDate";



const AdminEventsPage = async () => {

  const baseUrl = await getBaseUrl(); 

  const isPastEvent = (endDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of today

    const eventEnd = new Date(endDate);
    eventEnd.setHours(0, 0, 0, 0);

    return eventEnd < today;
  };

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
              <li key={event.id}>
                <div>
                  <p className="font-medium">{event.title}</p>
                  {isPastEvent(event.end_date) && (
                    <span className="text-xs rounded bg-gray-600 px-2 py-0.5"> PAST</span>
                  )}

                </div>

                {event.image_url && (
                  <img 
                    src={event.image_url}
                    alt={event.title}
                    className=" w-48 h-32 object-cover rounded border mt-3 mb-3"
                    
                  />
                )}

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
