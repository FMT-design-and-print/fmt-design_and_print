import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ForgotPassword } from "./ForgotPassword";
import { Metadata } from "next";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

export const metadata: Metadata = {
  title: "Forgot Password | FMT Design and Print",
};

interface Props {
  searchParams: {
    message: string;
    messageStatus: MessageStatus;
  };
}

const ForgotPasswordPage = async ({ searchParams }: Props) => {
  await redirectAdminUser();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect("/");
  }

  return (
    <>
      <ForgotPassword searchParams={searchParams} />
    </>
  );
};

export default ForgotPasswordPage;
