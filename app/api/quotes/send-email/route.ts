import { NextResponse } from "next/server";
import { Resend } from "resend";
import QuoteEmailTemplate from "@/emails/QuoteEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      to,
      subject,
      message: content,
      link,
      recipientName,
    } = await req.json();

    const data = await resend.emails.send({
      from: "FMT Design and Print <quotes@fmtdesignprint.com>",
      to: [to],
      subject: subject,
      react: QuoteEmailTemplate({ subject, content, link, recipientName }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
