import { MyAccount } from "@/features/my-account";
import { CustomRequests } from "@/features/my-account/custom-requests";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { ICustomOrder } from "@/types/order";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "My Account | Custom Requests | FMT Design and Print",
};

const MyAccountCustomRequestsPage = async () => {
  await redirectAdminUser();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session == null) {
    return redirect("/");
  }

  const { data: customRequests } = await supabase
    .from("custom-orders")
    .select(
      "id, created_at, orderId, status, totalAmount, orderDetails, itemType"
    )
    .eq("user_id", session.user.id);

  return (
    <div>
      <MyAccount email={session.user.email || ""}>
        <CustomRequests requests={(customRequests as ICustomOrder[]) || []} />
      </MyAccount>
    </div>
  );
};

export default MyAccountCustomRequestsPage;
