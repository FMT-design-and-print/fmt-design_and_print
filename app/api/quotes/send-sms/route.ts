import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  const { to, message } = await req.json();

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    return NextResponse.json({
      success: true,
      message: "SMS sent successfully",
      response,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to send SMS",
      error,
    });
  }
}

// Build is giving an error for this

// export function middleware(req: Request) {
//   if (req.method !== "POST") {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Method not allowed",
//       },
//       { status: 405 }
//     );
//   }
// }
