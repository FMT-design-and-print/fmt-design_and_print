import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { verifyLoggedInUser } from "@/lib/actions/user-check.actions";
import { MessageStatus } from "@/types";
import { Metadata } from "next";
import { ResendConfirmLinkForm } from "./ResendConfirmLinkForm";

export const metadata: Metadata = {
  title: "Resend Confirm Link | FMT Design and Print",
};

interface Props {
  message: string;
  messageStatus: MessageStatus;
}

const ResendConfirmLinkPage = async (props: {
  searchParams: Promise<Props>;
}) => {
  await redirectAdminUser();
  await verifyLoggedInUser();

  const searchParams = await props.searchParams;

  return (
    <>
      <ResendConfirmLinkForm searchParams={searchParams} />
    </>
  );
};

export default ResendConfirmLinkPage;
