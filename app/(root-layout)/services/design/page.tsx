import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { redirect } from "next/navigation";

const DesignServicesPage = async () => {
  await redirectAdminUser();

  return redirect("/services?st=design");
};

export default DesignServicesPage;
