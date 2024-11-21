import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { redirect } from "next/navigation";

export const revalidate = 0;

const AllPrintCategories = async () => {
  await redirectAdminUser();

  redirect("/services");
};

export default AllPrintCategories;
