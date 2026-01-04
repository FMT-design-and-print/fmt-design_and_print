import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { ContactFormEmail } from "@/emails/ContactFormEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const RECIPIENT_EMAILS = [
  "fmtdesignprint@gmail.com",
  "info@fmtdesignprint.com",
];

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate inputs
    if (!email || !message) {
      return Response.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const { data: messageData, error: supabaseError } = await supabase
      .from("messages")
      .insert([
        {
          source: email,
          subject: `Contact Form Message from ${name || "Anonymous"}`,
          content: message,
          status: "unread",
          metadata: {
            name,
            type: "contact_form",
            timestamp: new Date().toISOString(),
          },
          group: "inbox",
        },
      ])
      .select()
      .single();

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return Response.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    // Send email notification
    const { error: emailError } = await resend.emails.send({
      from: "FMT Design & Print <contact@fmtdesignprint.com>",
      to: RECIPIENT_EMAILS,
      replyTo: email,
      subject: `New Contact Form Message from ${name || "Anonymous"}`,
      react: ContactFormEmail({
        name: name || "Anonymous",
        email,
        message,
      }),
    });

    if (emailError) {
      console.error("Email error:", emailError);
      // We don't return error here since the message was saved to Supabase
    }

    return Response.json(
      {
        message: "Message sent successfully",
        data: messageData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
