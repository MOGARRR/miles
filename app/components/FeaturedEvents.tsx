import LinkButton from "./ui/LinkButton";
import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { headers } from "next/headers";
import { Event } from "@/src/types/event";
import EventCard from "./EventCard";


const FeaturedEvents = async () => {

  const baseUrl = await getBaseUrl();

  //fetch EVENTS from the api route
  const res = await fetch(`${baseUrl}/api/events`, { cache: "no-store" });
  const data: {events: Event[]} = await res.json();

  const events = data.events ?? [];

  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const featuredEvents = events
  .filter((e) => e.end_date >= today)
  .slice(0, 3);


  return (
    <section className="bg-kilodarkgrey">
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
          Upcoming Events
        </h1>

        <p className="
          text-base md:text-xl
          text-kilotextgrey
          pt-6"
        >
          Catch KiloBoy live at these exclusive pop-ups and exhibitions.
        </p>
      </div>

      {/* DISPLAY FEATURED EVENT CARDS */}
      <div>
        {featuredEvents.length === 0 ? (
          <p>No upcoming events right now. Stay tuned for more.</p>
        ) : (
          // STYLING NOTES: 
          // Create as many columns as possible (auto-fit)
          // Each column must be at least 280px wide
          // Columns can grow to fill the row (1fr)
          // If there are fewer items, the grid shrinks naturally
          <ul className="grid gap-12 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {featuredEvents.map((e) => (
            <EventCard 
              key={e.id} event={e}
            />
          ))}
          </ul>
        )}
      </div>

      {/* SEE ALL BUTTON - REDIRECTS TO EVENTS PAGE */}
      <div className="flex justify-center pt-8 pb-12">
        <LinkButton href="/events" variant="secondary">
          Browse All Events
        </LinkButton>
      </div>

      
      
    </div>

    </section>
    
  )
};

export default FeaturedEvents;
