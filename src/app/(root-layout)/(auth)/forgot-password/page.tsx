import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedInUser } from "@/lib/actions/user-check.actions";
import { MessageStatus } from "@/types";
import { Metadata } from "next";
import { ForgotPassword } from "./ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot Password | FMT Design and Print",
};

interface Props {
  searchParams: {
    message: string;
    messageStatus: MessageStatus;
  };
}

const ForgotPasswordPage = async ({ searchParams }: Props) => {
  await redirectAdminUser();
  await verifyLoggedInUser();

  return (
    <>
      <ForgotPassword searchParams={searchParams} />
    </>
  );
};

export default ForgotPasswordPage;
