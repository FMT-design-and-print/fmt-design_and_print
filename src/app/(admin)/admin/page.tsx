import { AdminLayout } from "@/features/admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | FMT Design and Print",
};

export default function AdminPage() {
  return (
    <>
      <AdminLayout />
    </>
  );
}
