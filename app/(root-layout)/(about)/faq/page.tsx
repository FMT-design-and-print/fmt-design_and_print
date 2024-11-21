import { Faq } from "@/components/FAQ/FAQ";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "FAQ | FMT Design and Print",
};

const FaqPage = async () => {
  await redirectAdminUser();

  return (
    <>
      <Faq />
    </>
  );
};

export default FaqPage;
