import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "@/app/login/LoginForm";
import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Box, Divider } from "@mantine/core";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

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
    <AuthCard title="Welcome Back, Sign In" searchParams={searchParams}>
      <>
        <GoogleAuthButton />
        <Divider label="Or Continue with" labelPosition="center" my="md" />
        <LoginForm />
        <Box pt="sm">
          <Link href="/forgot-password" className=" text-sm">
            Forgotten Password?
          </Link>
        </Box>
        <Box py="sm">
          <Link href="/signup" className="text-sm">
            Don’t have an account? Register
          </Link>
        </Box>
      </>
    </AuthCard>
  );
}
