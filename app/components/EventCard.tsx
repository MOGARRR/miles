import { Event } from "@/src/types/event";
import { formatDate } from "@/utils/date";
import { MapPin, Calendar1, Clock } from "lucide-react";


type EventCardProps = {
  event: Event;
}; 


const EventCard = ({ event }: EventCardProps) => {
  const isSingleDayEvent = event.start_date === event.end_date;

  return (
    <div className="
      rounded-xl border border-[#3a3a41]
      bg-kiloblack
      flex flex-col      
      pb-4
      "
    >
      {/* IMAGE */}
      <div className="flex">
        <div className="w-1/2">
          <img 
            src={event.image_url}
            alt={event.title}
            className=" w-full h-48 object-cover border border-[#3a3a41] rounded mb-2"
          />

        </div>
        
      </div>

      {/* EVENT INFO */}
      <div className="flex flex-col px-6 gap-2">

        <h1 className="
          mt-2 text-lg md:text-2xl font-bold"
        >
          {event.title}
        </h1>

        {event.description && (
          <p className="
            text-xs md:text-base text-kilotextgrey
            my-4"
          >
            {event.description}
          </p>
        )}
        
        <p className="
          text-xs md:text-sm text-kilotextlight"
        >
          {isSingleDayEvent ? (
            <span className="flex items-center gap-1">
              <Calendar1 size={14} className="text-kilored" />
              {formatDate(event.start_date)}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Calendar1 size={14} className="text-kilored"/>
              {formatDate(event.start_date)} - {formatDate(event.end_date)}
            </span>
          )}
        </p>
        
        {event.hours && (
          <span className="flex items-center gap-1 text-xs md:text-sm text-kilotextlight ">
            <Clock size={14} className="text-kilored"/> Hours: {event.hours}
          </span>
        )}    

        <span className="flex items-center gap-1 text-xs md:text-sm text-kilotextlight">
          <MapPin size={14} className="text-kilored"/> {event.location}
        </span>

      </div>
      
      
    </div>
  )
};

export default EventCard;
