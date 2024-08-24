import { AdminLayout } from "@/features/admin";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin | FMT Design and Print",
};

export default async function AdminPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/admin/login");
  }

  if (session && session.user.user_metadata.userType !== "admin") {
    return redirect("/");
  }

  const { data: admins } = await supabase
    .from("admins")
    .select("email, confirmed")
    .eq("email", session.user.email)
    .returns<{ email: String; confirmed: boolean }[]>();

  if (!admins?.[0].confirmed) {
    return redirect("/admin/reset-password");
  }

  return (
    <>
      <AdminLayout user={session.user} />
    </>
  );
}
