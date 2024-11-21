"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type VerifyUserOptions = {
  redirectPath?: string;
};
export async function verifyLoggedOutUser(options?: VerifyUserOptions) {
  const supabase = await createClient();

  const { redirectPath = "/" } = options || {};

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect(redirectPath);
  } else {
    return user;
  }
}

export async function verifyLoggedInUser(options?: VerifyUserOptions) {
  const supabase = await createClient();

  const { redirectPath = "/" } = options || {};

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect(redirectPath);
  }
}
