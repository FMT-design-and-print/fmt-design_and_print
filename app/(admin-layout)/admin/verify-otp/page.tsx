import { AuthCard } from "@/components/AuthCard";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedInUser } from "@/lib/actions/user-check.actions";
import { MessageStatus } from "@/types";
import { Text } from "@mantine/core";
import { Metadata } from "next";
import { OTPInput } from "./OTPInput";

export const metadata: Metadata = {
  title: "Login | FMT Design and Print",
};

interface SearchParamsOptions {
  message: string;
  messageStatus: MessageStatus;
}

export default async function VerifyOtpPage(props: {
  searchParams: Promise<SearchParamsOptions>;
}) {
  await redirectAdminUser();
  await verifyLoggedInUser();

  const searchParams = await props.searchParams;

  return (
    <>
      <AuthCard title="Confirm Password Reset" searchParams={searchParams}>
        <>
          <Text size="xs" ta="center" c="dimmed" mb="md">
            Enter code sent to your email
          </Text>

          <OTPInput />
        </>
      </AuthCard>
    </>
  );
}
