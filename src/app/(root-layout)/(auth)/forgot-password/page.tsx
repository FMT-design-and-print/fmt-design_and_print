import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedInUser } from "@/lib/actions/user-check.actions";
import { MessageStatus } from "@/types";
import { Metadata } from "next";
import { ForgotPassword } from "./ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot Password | FMT Design and Print",
};

interface Props {
  message: string;
  messageStatus: MessageStatus;
}

const ForgotPasswordPage = async (props: { searchParams: Promise<Props> }) => {
  await redirectAdminUser();
  await verifyLoggedInUser();

  const searchParams = await props.searchParams;

  return (
    <>
      <ForgotPassword searchParams={searchParams} />
    </>
  );
};

export default ForgotPasswordPage;
