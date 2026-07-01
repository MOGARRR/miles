export const formatCustomerEmail = (
  orderItems: any[],
  totalSessionAmount: number | null,
  shipping: {
    name: string | null;
    phoneNumber: string | null;
    address1: string | null;
    address2?: string;
    city: string | null;
    province: string | null;
    postal: string | null;
    country: string;
  },
  customerEmail: string,
) => {
  return `
    <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">
      
      <h1 style="margin-bottom:8px;border-bottom:2px solid #eee;padding-bottom:12px;">
        Thank You for Your Order!
      </h1>

      <p>
        Hi ${shipping.name},
      </p>

      <p>
        Thank you for supporting <strong>Kiloboy</strong>. Your order has been received and is now being processed.
        We'll keep you updated as it moves through production and shipping.
      </p>

      <h2 style="margin-top:32px;margin-bottom:12px;font-size:18px;">
        Order Summary
      </h2>

      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr style="background:#f7f7f7;">
            <th align="left" style="border-bottom:1px solid #ddd;">Artwork</th>
            <th align="center" style="border-bottom:1px solid #ddd;">Qty</th>
            <th align="right" style="border-bottom:1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems
            .map(
              (item: any) => `
                  <tr>
                    <td style="border-bottom:1px solid #eee;">
                      ${item.description}
                    </td>
                    <td align="center" style="border-bottom:1px solid #eee;">
                      ${item.quantity}
                    </td>
                    <td align="right" style="border-bottom:1px solid #eee;">
                      $${(item.amount_total / 100).toFixed(2)}
                    </td>
                  </tr>
                `,
            )
            .join("")}
        </tbody>
      </table>

      <p style="margin-top:24px;font-size:18px;">
        <strong>Total Paid</strong>
        <span style="float:right;">
          $${((totalSessionAmount ?? 0) / 100).toFixed(2)}
        </span>
      </p>

      <hr style="margin:32px 0;border:none;border-top:1px solid #eee;" />

        <h2 style="margin-bottom:12px;font-size:18px;">
          Customer Information
        </h2>

        <table width="100%" cellpadding="4" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="font-weight:bold;width:120px;">Name</td>
            <td>${shipping.name}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Email</td>
            <td>${customerEmail}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Phone</td>
            <td>${shipping.phoneNumber}</td>
          </tr>
        </table>

        <h2 style="margin-top:24px;margin-bottom:12px;font-size:18px;">
          Shipping Address
        </h2>

        <p style="margin:0;line-height:1.6;">
          ${shipping.name}<br />
          ${shipping.address1}<br />
          ${shipping.address2 ? `${shipping.address2}<br />` : ""}
          ${shipping.city}, ${shipping.province} ${shipping.postal}<br />
          ${shipping.country}
        </p>
      <hr style="margin:32px 0;border:none;border-top:1px solid #eee;" />

      <p>
        We appreciate your support and can't wait for you to receive your artwork.
      </p>

      <p>
        — <strong>Kiloboy</strong>
      </p>

      <p style="margin-top:32px;font-size:12px;color:#777;line-height:1.6;">
        This is an automated email. <strong>Please do not reply to this message.</strong><br />
        If you have any questions about your order, please contact us at
        <a href="mailto:kiloboyartwork@hotmail.com" style="color:#333;">
          kiloboyartwork@hotmail.com
        </a>.
      </p>
    </div>
  `;
};
