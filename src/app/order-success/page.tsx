import React from "react";
import { OrderSuccessHero } from "./Hero";

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
