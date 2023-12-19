import { AuthCard } from "@/components/AuthCard";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { SignupForm } from "@/components/forms/SignupForm";
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
    <AuthCard title="Welcome" searchParams={searchParams}>
      <>
        <GoogleAuthButton />
        <div>
          <p className="text-center text-sm leading-8 text-gray-600">
            Or Continue with
          </p>
        </div>
        <SignupForm />
        <div className="py-6">
          <Link href="/login" className=" text-sm">
            Already have an account? Login
          </Link>
        </div>
      </>
    </AuthCard>
  );
}
