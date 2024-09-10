import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import React from "react";

export const revalidate = 0;

const AllPrintCategories = async () => {
  await redirectAdminUser();

  return <div>All Print Categories</div>;
};

export default AllPrintCategories;
