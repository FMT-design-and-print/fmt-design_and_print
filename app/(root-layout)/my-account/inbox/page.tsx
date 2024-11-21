import { MyAccount } from "@/features/my-account";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedOutUser } from "@/lib/actions/user-check.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Inbox | FMT Design and Print",
};

const AccountInboxPage = async () => {
  await redirectAdminUser();
  const user = await verifyLoggedOutUser();

  return (
    <div>
      <MyAccount email={user?.email || ""}>Inboxs</MyAccount>
    </div>
  );
};

export default AccountInboxPage;
