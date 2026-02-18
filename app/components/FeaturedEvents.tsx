import Link from "next/link";
import { MoveRight } from "lucide-react";
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

  const hasEvents = featuredEvents.length > 0;
  const isSingleEvent = featuredEvents.length === 1;


  return (
    <section className="bg-kilodarkgrey">
      <div className="
        max-w-7xl mx-auto
        px-6 md:px-16
      ">
      {/* HEADING */}
      <div className="pt-20 pb-20">
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
          {hasEvents
          ? "Catch KiloBoy live at these exclusive pop-ups and exhibitions."
          : "No upcoming events. New pop-ups and exhibitions will be announced soon."
        }
          
        </p>
      </div>

      {/* DISPLAY FEATURED EVENT CARDS */}
      <div>
        {hasEvents && (
          <ul className="
            grid gap-12
            grid-cols-1
            md:grid-cols-2
            justify-items-center
          ">
            {featuredEvents.map((e) => (
           
              <EventCard event={e} />
           
            ))}
          </ul>
        )}
      </div>

      {/* SEE ALL BUTTON - REDIRECTS TO EVENTS PAGE */}
      {hasEvents && (
        <div className="flex justify-center p-12">
        <Link
            href="/events"
            className="
              inline-flex items-center gap-2
              text-base md:text-lg font-semibold
              text-kilotexlight
              group
              transition
            "
          >
            BROWSE ALL EVENTS
            <MoveRight 
              size={20}
              className="transition-transform group-hover:translate-x-1" />
          </Link>
      </div>

      )}
      

      
      
    </div>

    </section>
    
  )
};

export default FeaturedEvents;
