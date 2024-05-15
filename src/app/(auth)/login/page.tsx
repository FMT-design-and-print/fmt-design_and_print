import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "@/app/(auth)/login/LoginForm";
import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Alert, Box, Divider } from "@mantine/core";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | FMT Design and Print",
};

export default async function Signup({
  searchParams,
}: {
  searchParams: {
    message: string;
    messageStatus: MessageStatus;
    err_type?: string;
    error: string;
    error_description: string;
  };
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
      {searchParams?.err_type && (
        <Alert variant="light" color="orange" className="text-center">
          <p>We were unable to log you in Automatically. Login below </p>
        </Alert>
      )}

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
    </>
  );
}
