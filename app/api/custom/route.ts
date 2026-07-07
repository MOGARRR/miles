import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  formatCustomArtworkConfirmationEmail,
  formatCustomArtworkNotificationEmail,
} from "@/src/emails/formatCustomArtworkEmails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  return NextResponse.json({ ok: true, method: "GET" });
}

export async function POST(req: Request) {
  const { name, email, type, details } = await req.json();

  if (!name || !email || !type || !details) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 },
    );
  }

  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL;
  const shopEmail = process.env.CONTACT_TO_EMAIL;

  if (!fromEmail || !shopEmail) {
    console.error("[custom] missing CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL");
    return NextResponse.json(
      { ok: false, error: "Email is not configured." },
      { status: 500 },
    );
  }

  const submission = { name, email, type, details };

  try {
    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `We received your custom request — ${type}`,
        html: formatCustomArtworkConfirmationEmail(submission),
      }),
      resend.emails.send({
        from: fromEmail,
        to: shopEmail,
        replyTo: email,
        subject: `[KiloBoy Custom Request] ${type}`,
        html: formatCustomArtworkNotificationEmail(submission),
      }),
    ]);
  } catch (error) {
    console.error("[custom] failed to send email:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send your request. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
