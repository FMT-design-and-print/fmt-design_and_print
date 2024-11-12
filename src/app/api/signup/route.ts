import EmailVerificationTemplate from "@/EmailVerificationTemplate";
import { createAdminClient } from "@/utils/supabase/client";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const data = await request.json();
  const supabase = createAdminClient();

  const res = await supabase.auth.admin.generateLink({
    type: "signup",
    email: data.email,
    password: data.password,
  });

  if (res.data.properties?.email_otp) {
    const resendRes = await resend.emails.send({
      from: "FMT Design and Print | Signup <noreply@fmtdesignprint.com>",
      to: [data.email],
      subject: "Verify Email",
      react: EmailVerificationTemplate({
        verificationCode: res.data.properties?.email_otp,
      }),
    });
    return Response.json(resendRes);
  } else {
    return Response.json({ data: null, error: res.error });
  }
}
