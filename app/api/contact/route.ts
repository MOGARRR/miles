import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, method: "GET" })
}

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message ) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

    return NextResponse.json({ 
      ok: true, 
      received: { name, email, subject, message },
    });
}