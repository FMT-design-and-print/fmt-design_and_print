import { MyAccount } from "@/features/my-account";
import { ShippingAddresses } from "@/features/my-account/shipping-address";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { IShippingAddress } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "My Account | Shipping Addresses | FMT Design and Print",
};

const MyAccountShippingAddressPage = async () => {
  await redirectAdminUser();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session == null) {
    return redirect("/");
  }

  const { data: addresses } = await supabase
    .from("shipping-addresses")
    .select(
      "id,contactName,phone1,phone2,email,country,region,address,town,user_id"
    )
    .eq("user_id", session.user.id);

  return (
    <div>
      <MyAccount email={session.user.email || ""}>
        <ShippingAddresses
          addresses={addresses != null ? (addresses as IShippingAddress[]) : []}
        />
      </MyAccount>
    </div>
  );
};

export default MyAccountShippingAddressPage;
