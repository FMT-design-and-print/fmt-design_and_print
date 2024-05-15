import { Faq } from "@/components/FAQ/FAQ";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "FAQ | FMT Design and Print",
};

const FaqPage = () => {
  return (
    <>
      <Faq />
    </>
  );
};

export default FaqPage;
