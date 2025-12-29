import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  return NextResponse.json({ ok: true, method: "GET" })
}

export async function POST(req: Request) {
  const { name, email, type, details } = await req.json();

  if (!name || !email || !type || !details ) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `[KiloBoy Custom Request] ${type}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Details:</strong></p>
      <p>${details}</p>
    `,
  });

    return NextResponse.json({ 
      ok: true, 
    });
}