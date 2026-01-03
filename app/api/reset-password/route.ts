import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import { createAdminClient } from "@/utils/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  const supabase = createAdminClient();

  const res = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: "FMT Design and Print | <noreply@fmtdesignprint.com>",
      to: [email],
      subject: "Reset Password",
      react: ResetPasswordEmail({
        verificationCode: res.data.properties?.email_otp,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ message: "Email sent Successfully", ...data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
