import { NextResponse, NextRequest } from "next/server";
import {
  getUsersById,
  updateUser,
  deleteUser,
} from "@/src/controllers/userControllers";
import { RouteContext } from "@/src/types/routeContext";

//GET
export async function GET(
  request: NextRequest, context: RouteContext
) {
  try {
    const { id } = await context.params;
    const users = await getUsersById(id);
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/users error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: NextRequest, context: RouteContext
) {
  try {
    const { id } = await context.params;
    const updatedUserItem = await req.json();

    const result = await updateUser(id, updatedUserItem);

    return NextResponse.json({ users: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const result = await deleteUser(id);

    return NextResponse.json({ users: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );  
  }
}
