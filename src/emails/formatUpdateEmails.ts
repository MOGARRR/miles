import { updateEmail } from "../types/updateEmail";

export const formatUpdateEmail = (id: string, emailInfo: updateEmail) => {
  return `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:6px;font-family:Arial,Helvetica,sans-serif;color:#333;">
        
        <!-- Header -->
        <tr>
          <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
            <h1 style="margin:0;font-size:20px;color:#111;">
              Order #${id} Updated
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px;">
            <p style="margin:0 0 16px;font-size:14px;">
              <strong>New Order Information</strong>
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="padding:6px 0;"><strong>Customer Name:</strong></td>
                <td style="padding:6px 0;">${emailInfo.full_name}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>Address Line 1:</strong></td>
                <td style="padding:6px 0;">${emailInfo.address_line_1}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>Address Line 2:</strong></td>
                <td style="padding:6px 0;">${emailInfo.address_line_2 || ""}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>City:</strong></td>
                <td style="padding:6px 0;">${emailInfo.city}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>Province:</strong></td>
                <td style="padding:6px 0;">${emailInfo.province}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>Postal Code:</strong></td>
                <td style="padding:6px 0;">${emailInfo.postal}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>Email:</strong></td>
                <td style="padding:6px 0;">${emailInfo.email}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>Phone:</strong></td>
                <td style="padding:6px 0;">${emailInfo.phone_number}</td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">

            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="padding:6px 0;"><strong>Shipping Status:</strong></td>
                <td style="padding:6px 0;">${emailInfo.shipping_status}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>Tracking Number:</strong></td>
                <td style="padding:6px 0;">${emailInfo.tracking_number || ""}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;"><strong>Estimated Delivery:</strong></td>
                <td style="padding:6px 0;">${emailInfo.estimated_delivery || ""}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 24px;background-color:#f9fafb;font-size:12px;color:#6b7280;">
            This email was sent automatically. Please do not reply.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>`;
};
