import { NextResponse } from "next/server";
import { Resend } from "resend";
import MessageEmail from "@/emails/MessageEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, content } = await req.json();

    const data = await resend.emails.send({
      from: "FMT Design and Print <notifications@fmtdesignprint.com>",
      to: [to],
      subject: subject,
      react: MessageEmail({ subject, content }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
