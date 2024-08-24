import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Plain Items | FMT Design and Print",
};

export const revalidate = 0;

const PlainItems = async () => {
  await redirectAdminUser();

  return <div>Plain Items</div>;
};

export default PlainItems;
