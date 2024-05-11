import { MyAccount } from "@/features/my-account";
import { CustomRequests } from "@/features/my-account/custom-requests";
import { ICustomOrder } from "@/types/order";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const MyAccountCustomRequestsPage = async () => {
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
