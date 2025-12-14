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
    <div className="pt-24 px-6">
      <h1 className="text-2xl font-semibold">Upcoming Events</h1>
      <p>Catch KiloBoy live at these exclusive pop-ups and exhibitions.</p>
      

      <div className="flex ">
        {upcomingEvents.length === 0 ? (
          <p className="mt-6 text-gray-300">No upcoming events right now.</p>
        ) : (
          <ul className="">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        )}

      </div>

      

      
  
      
    </div>
  )
};

export default EventsPage;
