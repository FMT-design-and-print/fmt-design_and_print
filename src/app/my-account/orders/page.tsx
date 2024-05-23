import { MyAccount } from "@/features/my-account";
import { Orders } from "@/features/my-account/orders";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { IOrder } from "@/types/order";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "My Account | Orders | FMT Design and Print",
};

const MyAccountOrdersPage = async () => {
  await redirectAdminUser();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session == null) {
    return redirect("/");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id,created_at,orderId,items,totalAmount,status,deliveryDetails")
    .eq("user_id", session.user.id);

  return (
    <div>
      <MyAccount email={session.user.email || ""}>
        <Orders orders={(orders as IOrder[]) || []} />
      </MyAccount>
    </div>
  );
};

export default MyAccountOrdersPage;
