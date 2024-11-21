import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedOutUser } from "@/lib/actions/user-check.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Account | FMT Design and Print",
};

const MyAccountPage = async () => {
  await redirectAdminUser();
  await verifyLoggedOutUser();

  return redirect("/my-account/profile");
};

export default MyAccountPage;
