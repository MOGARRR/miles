import { updateEmail } from "../types/updateEmail";

export const formatUpdateEmail = (id: string, emailInfo: updateEmail) => {
  const tracking = emailInfo.tracking_number || "N/A";
  const isShipped = emailInfo.shipping_status === "Shipped";
  const upsTrackUrl = `https://www.ups.com/track?loc=en_CA&requester=ST&tracknum=${tracking}`;
  const title = isShipped ? "Your Order Has Shipped!" : "Order Update";
  const message = isShipped
    ? `Great news — your <strong>Kiloboy</strong> order is on its way. <a href="${upsTrackUrl}" style="color:#333;">Track your package at UPS</a> using the tracking number below.`
    : "Your <strong>Kiloboy</strong> order information has been updated. Here are the latest details:";

  return `
    <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">

      <h1 style="margin-bottom:8px;border-bottom:2px solid #eee;padding-bottom:12px;">
        ${title}
      </h1>

      <p>Hi ${emailInfo.full_name},</p>

      <p>${message}</p>

      <h2 style="margin-top:32px;margin-bottom:12px;font-size:18px;">
        Order #${id}
      </h2>

      <table width="100%" cellpadding="4" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="font-weight:bold;width:140px;">Status</td>
          <td>${emailInfo.shipping_status}</td>
        </tr>
        <tr>
          <td style="font-weight:bold;">Tracking Number</td>
          <td>
            ${
              isShipped && emailInfo.tracking_number
                ? `<a href="${upsTrackUrl}" style="color:#333;">${tracking}</a>`
                : tracking
            }
          </td>
        </tr>
      </table>

      <h2 style="margin-top:24px;margin-bottom:12px;font-size:18px;">
        Shipping Address
      </h2>

      <p style="margin:0;line-height:1.6;">
        ${emailInfo.full_name}<br />
        ${emailInfo.address_line_1}<br />
        ${emailInfo.address_line_2 ? `${emailInfo.address_line_2}<br />` : ""}
        ${emailInfo.city}, ${emailInfo.province} ${emailInfo.postal}<br />
        Canada
      </p>

      <hr style="margin:32px 0;border:none;border-top:1px solid #eee;" />

      <p>— <strong>Kiloboy</strong></p>

      <p style="margin-top:32px;font-size:12px;color:#777;line-height:1.6;">
        This is an automated email. <strong>Please do not reply to this message.</strong><br />
        Questions? Contact us at
        <a href="mailto:kiloboyartwork@hotmail.com" style="color:#333;">
          kiloboyartwork@hotmail.com
        </a>.
      </p>
    </div>
  `;
};
