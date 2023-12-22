import { AuthCard } from "@/components/AuthCard";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { LoginForm } from "@/app/login/LoginForm";
import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Signup({
  searchParams,
}: {
  searchParams: { message: string; messageStatus: MessageStatus };
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
    <AuthCard title="Welcome Back" searchParams={searchParams}>
      <>
        <GoogleAuthButton />
        <div>
          <p className="text-center text-sm leading-8 text-gray-600">
            Or Continue with
          </p>
        </div>
        <LoginForm />
        <div className="pt-6">
          <Link href="/forgot-password" className=" text-sm">
            Forgotten Password?
          </Link>
        </div>
        <div className="pb-6 pt-2">
          <Link href="/signup" className=" text-sm">
            Don’t have an account? Register
          </Link>
        </div>
      </>
    </AuthCard>
  );
}
