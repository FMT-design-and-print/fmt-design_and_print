"use server";
import { isAdminUser } from "@/functions/user";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function redirectAdminUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && isAdminUser(session.user)) {
    return redirect("/admin");
  }
}
