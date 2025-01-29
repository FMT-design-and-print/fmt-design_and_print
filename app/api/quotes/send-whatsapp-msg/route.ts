import { NextResponse } from "next/server";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function POST(req: Request) {
  const { to, message } = await req.json();

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "WhatsApp message sent successfully",
      response: data,
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to send WhatsApp message",
      error,
    });
  }
}
