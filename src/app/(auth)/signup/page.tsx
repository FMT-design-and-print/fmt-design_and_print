import { AuthCard } from "@/components/AuthCard";
import { SignupForm } from "@/app/(auth)/signup/SignupForm";
import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { Divider } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | FMT Design and Print",
};

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
    <AuthCard title="Welcome, Sign Up" searchParams={searchParams}>
      <>
        <GoogleAuthButton />
        <Divider label="Or Continue with" labelPosition="center" my="md" />
        <SignupForm />
        <div className="py-2">
          <Link href="/login" className=" text-sm">
            Already have an account? Login
          </Link>
        </div>
      </>
    </AuthCard>
  );
}
