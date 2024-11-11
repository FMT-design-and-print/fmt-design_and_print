import { AuthCard } from "@/components/AuthCard";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedInUser } from "@/lib/actions/user-check.actions";
import { MessageStatus } from "@/types";
import { Alert, Box, Divider } from "@mantine/core";
import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | FMT Design and Print",
};

interface serachParamsoptions {
  message: string;
  messageStatus: MessageStatus;
  err_type?: string;
  error: string;
  error_description: string;
}

export default async function Signup(props: {
  searchParams: Promise<serachParamsoptions>;
}) {
  await redirectAdminUser();
  await verifyLoggedInUser();

  const searchParams = await props.searchParams;

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
