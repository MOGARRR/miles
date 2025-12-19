import { updateEvent } from "@/src/controllers/eventsControllers";
import { NextResponse, NextRequest } from "next/server";

// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const updatedeventItem = await req.json();

    const result = await updateEvent(eventId, updatedeventItem);

    return NextResponse.json({ event: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}