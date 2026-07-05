import { NextResponse, NextRequest } from "next/server";
import { deleteOrder, getOrderById, updateOrder } from "@/src/controllers/orderControllers";
import { RouteContext } from "@/src/types/routeContext";
import { sendEmail } from "@/src/helpers/emails/sendEmail";
import { formatUpdateEmail } from "@/src/emails/formatUpdateEmails";

//GET
export async function GET(
  request: NextRequest, context: RouteContext
) {
  try {
    const { id } = await context.params;
    const orders = await getOrderById(id);
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/orders error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// PUT — update an order
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // send_shipped_emails is only used here — don't save it to the database
    const sendEmails = body.send_shipped_emails;
    delete body.send_shipped_emails;

    const result = await updateOrder(id, body);

    // Send emails to customer and admin when marking as shipped
    if (sendEmails) {
      const html = formatUpdateEmail(id, result);

      await sendEmail({
        to: result.email,
        subject: "Your KiloBoy Order Has Shipped",
        html,
      });

      await sendEmail({
        to: process.env.CONTACT_TO_EMAIL!,
        subject: `Order #${id} Shipped — ${result.full_name}`,
        html,
      });
    }

    return NextResponse.json({ orders: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

 // DELETE //CHANGE TO UPDATE CAUSE OF REFERENCE ERROR

export async function DELETE(request: NextRequest, context: RouteContext
) {
  try {
    const {id} = await context.params;

    const result = await deleteOrder(id);

    return NextResponse.json({ orders: result });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
