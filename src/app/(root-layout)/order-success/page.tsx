import React from "react";
import { OrderSuccessHero } from "./Hero";
import { Metadata } from "next";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

export const metadata: Metadata = {
  title: "Order Success | FMT Design and Print",
};

interface Props {
  reference: string;
}

const OrderSuccessPage = async (props: { searchParams: Promise<Props> }) => {
  await redirectAdminUser();

  const searchParams = await props.searchParams;

  return (
    <div>
      <OrderSuccessHero orderId={searchParams.reference} />
    </div>
  );
};

export default OrderSuccessPage;
