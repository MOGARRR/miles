"use client"

import { useEffect, useState } from "react";
import { Event } from "@/src/types/event";



const EventsPage = () => {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true); 



  useEffect (() => {
    async function loadEvents() {
      try {
        // PORT 3000 IN USE GO BACK TO THIS LATER
        // const res = await fetch (`${baseUrl}/api/events`); 
        const res = await fetch (`http://localhost:3001/api/events`); 
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
      <p className="mt-2 text-gray-300">Total fetched: {events.length}</p>
  
      
    </div>
  )
};

export default EventsPage;
