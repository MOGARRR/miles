import { NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/src/controllers/userControllers";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/users error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userItem = await req.json();
    const user = await createUser(userItem);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/users error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
