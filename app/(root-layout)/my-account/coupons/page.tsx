import { MyAccount } from "@/features/my-account";
import { Coupons } from "@/features/my-account/coupons";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedOutUser } from "@/lib/actions/user-check.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Coupons | FMT Design and Print",
};

const MyAccountCouponsPage = async () => {
  await redirectAdminUser();
  const user = await verifyLoggedOutUser();

  return (
    <div>
      <MyAccount email={user.email || ""}>
        <Coupons coupons={[]} />
      </MyAccount>
    </div>
  );
};

export default MyAccountCouponsPage;
