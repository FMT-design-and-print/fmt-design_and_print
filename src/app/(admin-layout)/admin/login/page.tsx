import { isAdminUser } from "@/functions/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "./Form";

interface SearchParamsOptions {
  message: string;
  err_type?: string;
  error: string;
  error_description: string;
}

const AdminLogin = async (props: {
  searchParams: Promise<SearchParamsOptions>;
}) => {
  const searchParams = await props.searchParams;
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
