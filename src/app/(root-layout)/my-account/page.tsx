import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Account | FMT Design and Print",
};

const MyAccountPage = async () => {
  await redirectAdminUser();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session == null) {
    return redirect("/");
  }

  return redirect("/my-account/profile");
};

export default MyAccountPage;
