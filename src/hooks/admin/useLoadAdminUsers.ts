import { IAdminUser } from "@/types/admin";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();
const getAdminUsers = async (): Promise<
  PostgrestSingleResponse<IAdminUser[]>
> => await supabase.from("admins").select("*");

export function useLoadAdminUsers() {
  const {
    isLoading,
    data: res,
    error,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });

  return {
    isLoading,
    adminUsers: res?.data,
    error: res?.error || error,
  };
}
