import { MyAccount } from "@/features/my-account";
import { ShippingAddresses } from "@/features/my-account/shipping-address";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedOutUser } from "@/lib/actions/user-check.actions";
import { IShippingAddress } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Shipping Addresses | FMT Design and Print",
};

const MyAccountShippingAddressPage = async () => {
  await redirectAdminUser();
  const user = await verifyLoggedOutUser();

  const supabase = await createClient();

  const { data: addresses } = await supabase
    .from("shipping-addresses")
    .select(
      "id,contactName,phone1,phone2,email,country,region,address,town,user_id"
    )
    .eq("user_id", user.id);

  return (
    <div>
      <MyAccount email={user.email || ""}>
        <ShippingAddresses
          addresses={addresses != null ? (addresses as IShippingAddress[]) : []}
        />
      </MyAccount>
    </div>
  );
};

export default MyAccountShippingAddressPage;
