import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedInUser } from "@/lib/actions/user-check.actions";
import { MessageStatus } from "@/types";
import { Metadata } from "next";
import { ResendConfirmLinkForm } from "./ResendConfirmLinkForm";

export const metadata: Metadata = {
  title: "Resend Confirm Link | FMT Design and Print",
};

interface Props {
  searchParams: {
    message: string;
    messageStatus: MessageStatus;
  };
}

const ResendConfirmLinkPage = async ({ searchParams }: Props) => {
  await redirectAdminUser();
  await verifyLoggedInUser();

  return (
    <>
      <ResendConfirmLinkForm searchParams={searchParams} />
    </>
  );
};

export default ResendConfirmLinkPage;
