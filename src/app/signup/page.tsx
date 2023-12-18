import { AuthCard } from "@/components/AuthCard";
import { SignupForm } from "@/components/forms/SignupForm";
import { verifyAccountMessage } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Signup({
  searchParams,
}: {
  searchParams: { message: string; action: string };
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
    <>
      {searchParams?.action && searchParams?.action === "verify" ? (
        <p className="mx-8 my-6 mb-1 bg-green-200 px-4 py-2 text-center text-green-600">
          {verifyAccountMessage}
        </p>
      ) : (
        <AuthCard searchParams={searchParams}>
          <>
            <SignupForm />
            <div className="py-6">
              <Link href="/login" className=" text-sm">
                Already have an account? Login
              </Link>
            </div>
          </>
        </AuthCard>
      )}
    </>
  );
}
