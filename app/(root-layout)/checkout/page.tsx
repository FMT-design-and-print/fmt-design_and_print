import { Checkout } from "@/features/checkout";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { IShippingAddress } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | FMT Design and Print",
};

const CheckoutPage = async () => {
  await redirectAdminUser();

  const supabase = await createClient();

  // load shipping addresses of logged in users
  let shippingAddresses: IShippingAddress[] = [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("shipping-addresses")
      .select("id,contactName,phone1,phone2,email,country,region,address,town")
      .eq("user_id", user.id);

    if (data != null) {
      shippingAddresses = data as IShippingAddress[];
    }
  }

  return (
    <>
      <Checkout shippingAddresses={user ? shippingAddresses : undefined} />
    </>
  );
};

export default CheckoutPage;
