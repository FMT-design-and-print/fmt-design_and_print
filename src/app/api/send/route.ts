import NewAdminUserEmail from "@/NewAdminUserEmail";
import { render } from "@react-email/components";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, firstName, tempPassword } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "FMT Design and Print | Admin <noreply@fmtdesignprint.com>",
      to: [email],
      subject: "Admin Account Created",
      html: render(
        NewAdminUserEmail({
          firstName,
          email,
          tempPassword,
        })
      ),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ message: "Email sent Successfully", ...data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
