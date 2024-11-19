import { Landing } from "@/features/landing";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

export const revalidate = 0;

export default async function Home() {
  await redirectAdminUser();

  return (
    <>
      <Landing />
    </>
  );
}
