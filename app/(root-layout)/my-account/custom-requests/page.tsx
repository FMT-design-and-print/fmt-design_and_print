import { MyAccount } from "@/features/my-account";
import { CustomRequests } from "@/features/my-account/custom-requests";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedOutUser } from "@/lib/actions/user-check.actions";
import { ICustomOrder } from "@/types/order";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Custom Requests | FMT Design and Print",
};

const MyAccountCustomRequestsPage = async () => {
  await redirectAdminUser();
  const user = await verifyLoggedOutUser();

  const supabase = await createClient();

  const { data: customRequests } = await supabase
    .from("custom-orders")
    .select(
      "id, created_at, orderId, status, totalAmount, orderDetails, itemTypes"
    )
    .eq("user_id", user.id)
    .returns<Partial<ICustomOrder[]>>();

  return (
    <div>
      <MyAccount email={user.email || ""}>
        <CustomRequests requests={customRequests || []} />
      </MyAccount>
    </div>
  );
};

export default MyAccountCustomRequestsPage;
