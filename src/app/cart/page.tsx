import { Cart } from "@/features/cart";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cart | FMT Design and Print",
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;
