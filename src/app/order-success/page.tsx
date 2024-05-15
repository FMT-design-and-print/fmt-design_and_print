import React from "react";
import { OrderSuccessHero } from "./Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Success | FMT Design and Print",
};

interface Props {
  searchParams: {
    reference: string;
  };
}

const OrderSuccessPage = ({ searchParams }: Props) => {
  return (
    <div>
      <OrderSuccessHero orderId={searchParams.reference} />
    </div>
  );
};

export default OrderSuccessPage;
