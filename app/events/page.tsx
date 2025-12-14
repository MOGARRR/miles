"use client"

import { useEffect, useState } from "react";
import { Event } from "@/src/types/event";

import EventCard from "../components/EventCard";


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
        <ul>
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ul>
      )}

      
  
      
    </div>
  )
};

export default EventsPage;
