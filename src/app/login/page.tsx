import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "@/components/forms/LoginForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Signup({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect("/");
  }

  return (
    <AuthCard searchParams={searchParams}>
      <>
        <LoginForm />
        <div className="py-6">
          <Link href="/signup" className=" text-sm">
            Don’t have an account? Register
          </Link>
        </div>
      </>
    </AuthCard>
  );
}
