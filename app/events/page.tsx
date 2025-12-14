"use client"

import { useEffect, useState } from "react";
import { Event } from "@/src/types/event";


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
        
        <p> Loading events... </p>
      </div>
    );
  }


  return (
    <div className="pt-24 px-6">
      <h1 className="text-2xl font-semibold">Events</h1>
      
      {upcomingEvents.length === 0 ? (
        <p className="mt-6 text-gray-300">No upcoming events right now.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {upcomingEvents.map((event) => (
            <li key={event.id} className="border-b border-gray-700 pb-4">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-gray-400">
                {event.start_date} – {event.end_date}
              </p>
              {event.location && (
                <p className="text-sm text-gray-400">{event.location}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      
  
      
    </div>
  )
};

export default EventsPage;
