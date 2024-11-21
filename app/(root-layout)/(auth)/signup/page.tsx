import { AuthCard } from "@/components/AuthCard";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedInUser } from "@/lib/actions/user-check.actions";
import { MessageStatus } from "@/types";
import { Divider } from "@mantine/core";
import { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Signup | FMT Design and Print",
};

interface MessageOptions {
  message: string;
  messageStatus: MessageStatus;
}

export default async function Signup(props: {
  searchParams: Promise<MessageOptions>;
}) {
  await redirectAdminUser();
  await verifyLoggedInUser();
  const searchParams = await props.searchParams;

  return (
    <AuthCard title="Welcome, Sign Up" searchParams={searchParams}>
      <>
        <GoogleAuthButton />
        <Divider label="Or Continue with" labelPosition="center" my="sm" />
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
