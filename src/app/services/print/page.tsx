import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Print Services | FMT Design and Print",
};

const PrintServicesPage = async () => {
  await redirectAdminUser();

  return redirect("/services");
};

export default PrintServicesPage;
