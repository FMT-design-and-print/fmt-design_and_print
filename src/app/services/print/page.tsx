import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Print Services | FMT Design and Print",
};

const PrintServicesPage = () => {
  return redirect("/services");
};

export default PrintServicesPage;
