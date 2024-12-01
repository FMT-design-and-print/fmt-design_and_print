import { createClient } from "@/utils/supabase/client";
import { IAdminUser } from "@/types/admin";
import { useSession } from "@/store";
import { useQuery } from "@tanstack/react-query";

const ADMIN_USER_QUERY_KEY = ["admin-user"] as const;

async function fetchAdminUser(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admins")
    .select("id, email, firstName, lastName, avatar, role")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as IAdminUser;
}

export function useCurrentAdminUser() {
  const { user } = useSession();

  const {
    data: adminUser,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [...ADMIN_USER_QUERY_KEY, user?.id],
    queryFn: () => fetchAdminUser(user?.id as string),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
  });

  return {
    adminUser,
    loading,
    error: error as Error | null,
  };
}

// Export the query key for potential invalidation
export { ADMIN_USER_QUERY_KEY };
