export type CustomArtworkSubmission = {
  name: string;
  email: string;
  type: string;
  details: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDetailsHtml(details: string): string {
  return escapeHtml(details).replace(/\n/g, "<br />");
}

function requestDetailsTable(submission: CustomArtworkSubmission): string {
  const name = escapeHtml(submission.name);
  const email = escapeHtml(submission.email);
  const type = escapeHtml(submission.type);

  return `
    <table width="100%" cellpadding="4" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td style="font-weight:bold;width:160px;">Name</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">Email</td>
        <td>${email}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">Type of Request</td>
        <td>${type}</td>
      </tr>
    </table>

    <h2 style="margin-top:24px;margin-bottom:12px;font-size:18px;">
      Details
    </h2>

    <p style="margin:0;line-height:1.6;">
      ${formatDetailsHtml(submission.details)}
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

/** Confirmation sent to the customer after they submit a custom artwork request. */
export function formatCustomArtworkConfirmationEmail(
  submission: CustomArtworkSubmission,
): string {
  return `
    <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">

      <h1 style="margin-bottom:8px;border-bottom:2px solid #eee;padding-bottom:12px;">
        We Got Your Custom Request!
      </h1>

      <p>Hi ${escapeHtml(submission.name)},</p>

      <p>
        Thanks for your interest in a custom piece from <strong>Kiloboy</strong>.
        We've received your request and will review it within 2–3 business days
        with a quote and timeline.
      </p>

      <h2 style="margin-top:32px;margin-bottom:12px;font-size:18px;">
        Your Request
      </h2>

      ${requestDetailsTable(submission)}

      ${emailFooter()}
    </div>
  `;
}

/** Notification sent to the shop inbox when someone submits a custom artwork request. */
export function formatCustomArtworkNotificationEmail(
  submission: CustomArtworkSubmission,
): string {
  return `
    <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">

      <h1 style="margin-bottom:8px;border-bottom:2px solid #eee;padding-bottom:12px;">
        New Custom Artwork Request
      </h1>

      <p>
        Someone submitted a custom artwork request on <strong>Kiloboy</strong>.
        Reply directly to this email to respond to the customer.
      </p>

      <h2 style="margin-top:32px;margin-bottom:12px;font-size:18px;">
        Request Details
      </h2>

      ${requestDetailsTable(submission)}

      ${emailFooter()}
    </div>
  `;
}
