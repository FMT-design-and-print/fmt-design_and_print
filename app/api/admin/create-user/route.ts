import { baseUrl } from "@/constants";
import NewAdminUserEmail from "@/emails/NewAdminUserEmail";
import { createAdminClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  role: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatar: z.string().min(1),
  sendMail: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || baseUrl;
  const body = await request.json();
  const parse = schema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { success: false, errors: parse.error.flatten() },
      { status: 400 }
    );
  }

  const { role, email, password, firstName, lastName, avatar, sendMail } =
    parse.data;

  const supabaseAdmin = createAdminClient();
  const { data: createdUser, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        userType: "admin",
        role,
        firstName,
        lastName,
        avatar,
      },
    });

  if (createUserError) {
    return NextResponse.json(
      { success: false, message: "Error creating user", error: createUserError },
      { status: 500 }
    );
  }

  const { error: addDataError } = await supabaseAdmin.from("admins").insert([
    {
      id: createdUser.user?.id,
      role,
      email,
      firstName,
      lastName,
      avatar,
    },
  ]);

  if (addDataError) {
    return NextResponse.json(
      {
        success: false,
        message: "Error saving user details to DB",
        error: addDataError,
      },
      { status: 500 }
    );
  }

  let emailResult: unknown = null;
  if (sendMail) {
    try {
      const { data } = await resend.emails.send({
        from: "FMT Design and Print | Admin <auth@fmtdesignprint.com>",
        to: [email],
        subject: "Admin Account Created",
        react: NewAdminUserEmail({
          firstName,
          email,
          tempPassword: password,
          origin,
        }),
      });
      emailResult = data;
    } catch (e) {
      emailResult = { error: true };
    }
  }

  return NextResponse.json({
    success: true,
    message: "Admin user created successfully",
    data: { userId: createdUser.user?.id, email: emailResult },
  });
}
