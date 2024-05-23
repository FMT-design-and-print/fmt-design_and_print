import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import React from "react";

export const revalidate = 0;

const Deals = async () => {
  await redirectAdminUser();

  return <div>Deals</div>;
};

export default Deals;
