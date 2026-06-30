export const formatCustomerEmail = (lineItems: any, totalSessionAmount: number | null) => {
  return `
      <div style="max-width:600px;font-family:Arial,Helvetica,sans-serif;color:#333;">
      <h1 style="border-bottom:2px solid #eee;padding-bottom:8px;">
      Kiloboy Artwork Order Receipt
      </h1>
      <p style="margin:16px 0 8px;">
      <strong>Order Items</strong>
      </p>
      <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <thead>
        <tr style="background:#f7f7f7;">
          <th align="left" style="border-bottom:1px solid #ddd;">Item</th>
          <th align="center" style="border-bottom:1px solid #ddd;">Qty</th>
          <th align="right" style="border-bottom:1px solid #ddd;">Price</th>
        </tr>
      </thead>
      <tbody>
      ${lineItems.data.map((item: any) =>
        `<tr>
        <td style="border-bottom:1px solid #eee;">
        ${item.description}
        </td>
        <td align="center" style="border-bottom:1px solid #eee;">
        ${item.quantity ?? 1}
        </td>
        <td align="right" style="border-bottom:1px solid #eee;">
        $${(item.amount_total! / 100).toFixed(2)}
        </td>
        </tr>`,
        )
        .join("")}
      </tbody>
      </table>
      <p style="margin-top:16px;font-size:16px;">
      <strong>Total Paid:</strong>
      <span style="float:right;">
      $${(totalSessionAmount! / 100).toFixed(2)}
      </span>
      </p>
      <p style="margin-top:32px;font-size:12px;color:#777;">
      Thank you for your purchase! This email was sent automatically. Please do not reply.
      </p>
      </div>`;
};
