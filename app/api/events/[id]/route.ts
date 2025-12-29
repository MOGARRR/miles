import { NextResponse, NextRequest } from "next/server";
import { updateEvent, deleteEvent } from "@/src/controllers/eventsControllers";

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

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    const result = await deleteEvent(eventId);

    return NextResponse.json({ event: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
