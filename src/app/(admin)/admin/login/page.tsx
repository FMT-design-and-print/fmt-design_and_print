import React from "react";
import { AdminLoginForm } from "./Form";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/functions/user";

const AdminLogin = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    if (isAdminUser(session.user)) {
      return redirect("/admin");
    }

    return redirect("/");
  }

  return (
    <>
      <AdminLoginForm />
    </>
  );
};

export default AdminLogin;
