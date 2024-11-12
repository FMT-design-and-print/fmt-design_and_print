import { AdminLayout } from "@/features/admin";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin | FMT Design and Print",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/login");
  }

  if (user.user_metadata.userType !== "admin") {
    return redirect("/");
  }

  const { data: admins } = await supabase
    .from("admins")
    .select("email, confirmed")
    .eq("email", user.email ?? "")
    .returns<{ email: String; confirmed: boolean }[]>();

  if (!admins?.[0].confirmed) {
    return redirect("/admin/reset-password");
  }

  return (
    <>
      <AdminLayout user={user} />
    </>
  );
}
