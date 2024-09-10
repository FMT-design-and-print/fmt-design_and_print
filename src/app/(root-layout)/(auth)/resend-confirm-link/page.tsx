import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ResendConfirmLinkForm } from "./ResendConfirmLinkForm";
import { Metadata } from "next";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

export const metadata: Metadata = {
  title: "Resend Confirm Link | FMT Design and Print",
};

interface Props {
  searchParams: {
    message: string;
    messageStatus: MessageStatus;
  };
}

const ResendConfirmLinkPage = async ({ searchParams }: Props) => {
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
      <ResendConfirmLinkForm searchParams={searchParams} />
    </>
  );
};

export default ResendConfirmLinkPage;
