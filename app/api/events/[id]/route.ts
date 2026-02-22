import { NextResponse, NextRequest } from "next/server";
import { updateEvent, deleteEvent } from "@/src/controllers/eventsControllers";
import { RouteContext } from "@/src/types/routeContext";

// PUT
export async function PUT(
req: NextRequest, context: RouteContext
) {
  try {
    const { id } = await context.params;
    const updatedeventItem = await req.json();

    const result = await updateEvent(id, updatedeventItem);

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
 request: NextRequest, context: RouteContext
) {
  try {
    const { id } = await context.params ;

    const result = await deleteEvent(id);

    return NextResponse.json({ event: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
