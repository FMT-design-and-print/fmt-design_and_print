import { AuthCard } from "@/components/AuthCard";
import { PasswordResetForm } from "@/app/(auth)/reset-password/PasswordResetForm";
import { MessageStatus } from "@/types";
import Link from "next/link";
import { Button } from "@mantine/core";

interface Props {
  searchParams: {
    message: string;
    messageStatus: MessageStatus;
    error_code: string;
  };
}

const ResetPassword = ({ searchParams }: Props) => {
  const message = searchParams?.message;
  const messageStatus = searchParams.messageStatus as MessageStatus;
  const errorCode = searchParams?.error_code;

  const linkExpired = (errorCode && errorCode === "401") || false;

  return (
    <>
      {linkExpired ? (
        <div className="mx-auto my-4 max-w-[400px] text-center">
          <p className=" mb-2 bg-red-100 px-4 py-2 text-sm text-red-600">
            Password reset link is invalid or has expired
          </p>
          <Link href="/forgot-password">
            <Button variant="subtle" radius="sm">
              Request new link
            </Button>
          </Link>
        </div>
      ) : (
        <AuthCard
          title="Reset Password"
          searchParams={{ message: message || "", messageStatus }}
        >
          <PasswordResetForm />
        </AuthCard>
      )}
    </>
  );
};

export default ResetPassword;
