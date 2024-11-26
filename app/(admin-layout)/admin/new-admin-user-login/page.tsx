import { isAdminUser } from "@/functions/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NewAdminUserLoginForm } from "./Form";

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
      await supabase.auth.signOut();
      return redirect("/admin/login");
    }

    if (!isAdminUser(user)) {
      return redirect("/");
    }

    const { data: admins } = await supabase
      .from("admins")
      .select("email, confirmed")
      .eq("email", user.email ?? "")
      .returns<{ email: string; confirmed: boolean }[]>();

    if (admins?.[0].confirmed) {
      return redirect("/admin");
    }
  }

  return (
    <>
      <NewAdminUserLoginForm />
    </>
  );
};

export default AdminLogin;
