import { NextPage } from "next";
import { ForgotPassword } from "./ForgotPassword";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const ForgotPasswordPage: NextPage = async () => {
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
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordPage;
