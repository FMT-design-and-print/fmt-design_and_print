import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ForgotPassword } from "./ForgotPassword";

interface Props {
  searchParams: {
    message: string;
    messageStatus: MessageStatus;
  };
}

const ForgotPasswordPage = async ({ searchParams }: Props) => {
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
