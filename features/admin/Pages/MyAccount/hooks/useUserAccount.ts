import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { IAdminUser } from "@/types/admin";

export function useUserAccount() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as IAdminUser;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<IAdminUser>) => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) throw new Error("No user found");

      const { data, error } = await supabase
        .from("admins")
        .update(updates)
        .eq("id", authUser.id)
        .select()
        .single();

      if (error) throw error;
      return data as IAdminUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  return {
    user,
    isLoading,
    updateProfile,
  };
}
