import { Cart } from "@/features/cart";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cart | FMT Design and Print",
};

const CartPage = async () => {
  await redirectAdminUser();

  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;
