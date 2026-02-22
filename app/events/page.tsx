"use client"

import { useEffect, useState } from "react";
import { Event } from "@/src/types/event";


import EventCard from "../components/EventCard";
import LoadingAnimation from "../components/LoadingAnimation";


const EventsPage = () => {

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true); 

  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const upcomingEvents = events.filter((e) => e.end_date >= today); 

  const hasEvents = upcomingEvents.length > 0; 
  


  useEffect (() => {
    async function loadEvents() {
      try {
        const res = await fetch ("/api/events"); 
        const json = await res.json(); 
        setEvents(json.events ?? []); 
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  },[]);


  if (loading) {
    return (
      <div>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <section className="
      bg-gradient-to-l from-kilodarkgrey to-kiloblack 
      py-24"
    >

      <div className="
        max-w-7xl mx-auto
        px-6 md:px-16 
        "
      >

        <div className={hasEvents ? "mb-24" : ""}>
          <h1 className="
            text-4xl md:text-6xl font-bold text-kilored text-center"
          >
          Upcoming Events
        </h1>
        <p className="
          max-w-[800px] mx-auto mt-8
          text-base md:text-lg text-gray-200  text-center"
        >
          {hasEvents 
          ? "Catch KiloBoy live at these exclusive pop-ups and exhibitions."
          : "No upcoming events. New pop-ups and exhibitions will be announced soon." }
         
        </p>

        </div>
        

        {hasEvents && (
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-8
            md:px-8
          ">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
         
      </div>
      
    </section>
  )
};

export default EventsPage;
