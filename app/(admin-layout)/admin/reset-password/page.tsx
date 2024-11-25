import React from "react";
import { AdminResetPasswordForm } from "./Form";
import { createClient } from "@/utils/supabase/server";
import { isAdminUser } from "@/functions/user";
import { redirect } from "next/navigation";

export interface SearchParams {
  code?: string;
  type?: string;
}

const AdminResetPassword = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/login");
  }

  if (isAdminUser(user)) {
    return <AdminResetPasswordForm />;
  }

  return redirect("/");
};

export default AdminResetPassword;
