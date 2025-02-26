import { MyAccount } from "@/features/my-account";
import { Orders } from "@/features/my-account/orders";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedOutUser } from "@/lib/actions/user-check.actions";
import { IOrder } from "@/types/order";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Orders | FMT Design and Print",
};

const MyAccountOrdersPage = async () => {
  await redirectAdminUser();
  const user = await verifyLoggedOutUser();

  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .returns<Partial<IOrder[]>>();

  return (
    <div>
      <MyAccount email={user.email || ""}>
        <Orders orders={(orders as IOrder[]) || []} />
      </MyAccount>
    </div>
  );
};

export default MyAccountOrdersPage;
