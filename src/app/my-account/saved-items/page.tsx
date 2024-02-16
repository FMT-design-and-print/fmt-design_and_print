import { MyAccount } from "@/features/my-account";
import { SavedItems } from "@/features/my-account/saved-items";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const SavedItemsPage = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session == null) {
    return redirect("/");
  }

  return (
    <div>
      <MyAccount email={session.user.email || ""}>
        <SavedItems savedItems={[]} />
      </MyAccount>
    </div>
  );
};

export default SavedItemsPage;
