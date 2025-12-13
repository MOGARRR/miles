import { NextResponse } from "next/server";
import { getAllEvents } from "@/src/controllers/eventsControllers";


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

