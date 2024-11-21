import { MyAccount } from "@/features/my-account";
import { ProfileForm } from "@/features/my-account/profile/Form";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedOutUser } from "@/lib/actions/user-check.actions";
import { createClient } from "@/utils/supabase/server";
import { Alert } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Profile | FMT Design and Print",
};

const MyAccountProfilePage = async () => {
  await redirectAdminUser();
  const user = await verifyLoggedOutUser();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      "firstName, lastName, profileImage, phone, country, region, gender, dateOfBirth"
    )
    .eq("id", user.id)
    .limit(1);

  return (
    <div>
      <MyAccount email={user.email || ""}>
        {error ? (
          <Alert variant="light" maw={400} mx="auto" color="red">
            Failed to Load profile details. Try again.
          </Alert>
        ) : (
          <ProfileForm
            user={{
              id: user.id,
              email: user.email,
              ...data[0],
              dateOfBirth: new Date(data[0].dateOfBirth ?? ""),
            }}
            isUserSaved={data?.length !== 0}
          />
        )}
      </MyAccount>
    </div>
  );
};

export default MyAccountProfilePage;
