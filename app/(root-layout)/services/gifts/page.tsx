import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gifts and Packages | FMT Design and Print",
};

export const revalidate = 0;

const Gifts = async () => {
  await redirectAdminUser();

  return <div>Gift and Packages</div>;
};

export default Gifts;
