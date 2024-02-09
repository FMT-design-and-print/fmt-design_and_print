import { MyAccount } from "@/features/my-account";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const RecentlySearchedPage = async () => {
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
      <MyAccount user={session.user}>Recently Searched</MyAccount>
    </div>
  );
};

export default RecentlySearchedPage;
