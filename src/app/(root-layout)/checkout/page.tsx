import { Checkout } from "@/features/checkout";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { IShippingAddress } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

export const metadata: Metadata = {
  title: "Checkout | FMT Design and Print",
};

const CheckoutPage = async () => {
  await redirectAdminUser();

  // load shipping addresses of logged in users
  let shippingAddresses: IShippingAddress[] = [];

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { data } = await supabase
      .from("shipping-addresses")
      .select("id,contactName,phone1,phone2,email,country,region,address,town")
      .eq("user_id", session.user.id);

    if (data != null) {
      shippingAddresses = data as IShippingAddress[];
    }
  }

  return (
    <>
      <Checkout shippingAddresses={session ? shippingAddresses : undefined} />
    </>
  );
};

export default CheckoutPage;
