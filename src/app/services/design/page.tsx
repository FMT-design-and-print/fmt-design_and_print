import { redirect } from "next/navigation";

const DesignServicesPage = () => {
  return redirect("/services?st=design");
};

export default DesignServicesPage;
