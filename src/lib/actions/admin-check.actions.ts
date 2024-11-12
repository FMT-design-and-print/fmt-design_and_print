"use server";
import { isAdminUser } from "@/functions/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function redirectAdminUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAdminUser(user)) {
    return redirect("/admin");
  }
}
