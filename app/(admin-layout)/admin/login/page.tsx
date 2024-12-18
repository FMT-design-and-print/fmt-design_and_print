import { isAdminUser } from "@/functions/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "./Form";
import { Alert, Center } from "@mantine/core";

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

    if (isAdminUser(user)) {
      return redirect("/admin");
    }

    return redirect("/");
  }

  return (
    <>
      <AdminLoginForm />
      <Center>
        {searchParams.err_type === "bad_code" && searchParams.message && (
          <Alert color="gray">{searchParams.message}</Alert>
        )}
      </Center>
    </>
  );
};

export default AdminLogin;
