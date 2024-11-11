import { MyAccount } from "@/features/my-account";
import { SavedItems } from "@/features/my-account/saved-items";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedOutUser } from "@/lib/actions/user-check.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Saved Items | FMT Design and Print",
};

const SavedItemsPage = async () => {
  await redirectAdminUser();
  const user = await verifyLoggedOutUser();

  return (
    <div>
      <MyAccount email={user.email || ""}>
        <SavedItems savedItems={[]} />
      </MyAccount>
    </div>
  );
};

export default SavedItemsPage;
