import { NextResponse } from "next/server";
import { getAllEvents,createEvent } from "@/src/controllers/eventsControllers";


// GET
export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/events error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });

  }
}

//POST
export async function POST(req: Request) {
  try {
    const eventItem = await req.json();
    const event = await createEvent(eventItem);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/events error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}