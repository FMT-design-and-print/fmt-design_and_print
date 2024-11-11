import { isAdminUser } from "@/functions/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "./Form";

const AdminLogin = async ({
  searchParams,
}: {
  searchParams: {
    message: string;
    err_type?: string;
    error: string;
    error_description: string;
  };
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (searchParams.error === "access_denied") {
      supabase.auth.signOut();
      return redirect("/admin/login");
    }

    if (isAdminUser(user)) {
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
