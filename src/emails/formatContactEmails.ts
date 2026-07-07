export type ContactFormSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMessageHtml(message: string): string {
  return escapeHtml(message).replace(/\n/g, "<br />");
}

function contactDetailsTable(submission: ContactFormSubmission): string {
  const name = escapeHtml(submission.name);
  const email = escapeHtml(submission.email);
  const subject = escapeHtml(submission.subject);

  return `
    <table width="100%" cellpadding="4" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td style="font-weight:bold;width:120px;">Name</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">Email</td>
        <td>${email}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">Subject</td>
        <td>${subject}</td>
      </tr>
    </table>

    <h2 style="margin-top:24px;margin-bottom:12px;font-size:18px;">
      Message
    </h2>

    <p style="margin:0;line-height:1.6;">
      ${formatMessageHtml(submission.message)}
    </p>
  `;
}

function emailFooter(): string {
  return `
    <hr style="margin:32px 0;border:none;border-top:1px solid #eee;" />

    <p>— <strong>Kiloboy</strong></p>

    <p style="margin-top:32px;font-size:12px;color:#777;line-height:1.6;">
      This is an automated email. <strong>Please do not reply to this message.</strong><br />
      Questions? Contact us at
      <a href="mailto:kiloboyartwork@hotmail.com" style="color:#333;">
        kiloboyartwork@hotmail.com
      </a>.
    </p>
  `;
}

/** Confirmation sent to the customer after they submit the contact form. */
export function formatContactConfirmationEmail(
  submission: ContactFormSubmission,
): string {
  return `
    <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">

      <h1 style="margin-bottom:8px;border-bottom:2px solid #eee;padding-bottom:12px;">
        We Got Your Message!
      </h1>

      <p>Hi ${escapeHtml(submission.name)},</p>

      <p>
        Thanks for reaching out to <strong>Kiloboy</strong>. We've received your message
        and will get back to you as soon as possible.
      </p>

      <h2 style="margin-top:32px;margin-bottom:12px;font-size:18px;">
        Your Message
      </h2>

      ${contactDetailsTable(submission)}

      ${emailFooter()}
    </div>
  `;
}

/** Notification sent to the shop inbox when someone submits the contact form. */
export function formatContactNotificationEmail(
  submission: ContactFormSubmission,
): string {
  return `
    <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">

      <h1 style="margin-bottom:8px;border-bottom:2px solid #eee;padding-bottom:12px;">
        New Contact Form Message
      </h1>

      <p>
        Someone submitted the contact form on <strong>Kiloboy</strong>.
        Reply directly to this email to respond to the customer.
      </p>

      <h2 style="margin-top:32px;margin-bottom:12px;font-size:18px;">
        Contact Details
      </h2>

      ${contactDetailsTable(submission)}

      ${emailFooter()}
    </div>
  `;
}
