import { MyAccount } from "@/features/my-account";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "My Account | Recently Viewed | FMT Design and Print",
};

const RecentlyViewedPage = async () => {
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
      <MyAccount email={session.user.email || ""}>Recently Viewed</MyAccount>
    </div>
  );
};

export default RecentlyViewedPage;
