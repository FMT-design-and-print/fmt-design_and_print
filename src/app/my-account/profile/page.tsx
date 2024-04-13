import { MyAccount } from "@/features/my-account";
import { ProfileForm } from "@/features/my-account/profile/Form";
import { createClient } from "@/utils/supabase/server";
import { Alert } from "@mantine/core";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const MyAccountProfilePage = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session == null) {
    return redirect("/");
  }

  const { data, error } = await supabase
    .from("users")
    .select(
      "firstName, lastName, profileImage, phone, country, region, gender, dateOfBirth"
    )
    .eq("id", session.user.id)
    .limit(1);

  return (
    <div>
      <MyAccount email={session.user.email || ""}>
        {error ? (
          <Alert variant="light" maw={400} mx="auto" color="red">
            Failed to Load profile details. Try again.
          </Alert>
        ) : (
          <ProfileForm
            user={{
              id: session.user.id,
              email: session.user.email,
              ...data[0],
            }}
            isUserSaved={data?.length !== 0}
          />
        )}
      </MyAccount>
    </div>
  );
};

export default MyAccountProfilePage;
