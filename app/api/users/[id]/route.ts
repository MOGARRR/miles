import { NextResponse, NextRequest } from "next/server";
import {
  getUsersById,
  updateUser,
  deleteUser,
} from "@/src/controllers/userControllers";

//GET
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const users = await getUsersById(params.id);
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/users error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const updatedUserItem = await req.json();

    const result = await updateUser(userId, updatedUserItem);

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
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const result = await deleteUser(userId);

    return NextResponse.json({ users: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );  
  }
}
