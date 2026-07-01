export const formatOrderEmail = (
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
  customerEmail: string
) => {
  return `
    <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">

      <h1 style="margin-bottom:8px;border-bottom:2px solid #eee;padding-bottom:12px;">
        🎉 New Order Received
      </h1>

      <p>
        A new order has been placed on <strong>Kiloboy</strong>.
      </p>

      <p style="margin-top:8px;color:#666;font-size:14px;">
        Customer: <strong>${shipping.name}</strong> (${customerEmail})
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
              `
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
        Log in to the Kiloboy admin dashboard to manage this order, update status,
        and generate shipping if required.
      </p>

    </div>
  `;
};