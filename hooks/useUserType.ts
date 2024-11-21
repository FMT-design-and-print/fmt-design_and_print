import { isAdminUser } from "@/functions/user";
import { useSession } from "@/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useUserType = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSession();

  useEffect(() => {
    if (user && isAdminUser(user) && !pathname.includes("/admin")) {
      router.push("/admin");
    }
  }, [pathname, router, user]);

  return user?.user_metadata.userType;
};
