import { MyAccount } from "@/features/my-account";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "My Account | Recently Searched | FMT Design and Print",
};

const RecentlySearchedPage = async () => {
  await redirectAdminUser();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session == null) {
    return redirect("/");
  }

  return (
    <div>
      <MyAccount email={session.user.email || ""}>Recently Searched</MyAccount>
    </div>
  );
};

export default RecentlySearchedPage;
