import { MyAccount } from "@/features/my-account";
import { Coupons } from "@/features/my-account/coupons";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "My Account | Coupons | FMT Design and Print",
};

const MyAccountCouponsPage = async () => {
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
      <MyAccount email={session.user.email || ""}>
        <Coupons coupons={[]} />
      </MyAccount>
    </div>
  );
};

export default MyAccountCouponsPage;
