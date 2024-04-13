import { useSession } from "@/store";
import { IUserDetails } from "@/types/user";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const eAP: Promise<IUserDetails[]> = new Promise((resolve, _reject) => {
  resolve([]);
});

const supabase = createClient();

const fetchUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, firstName, lastName, profileImage, phone, country, region, gender, dateOfBirth"
    )
    .eq("id", userId)
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data as IUserDetails[];
};

export function useUser() {
  const { session } = useSession();

  const { isLoading, data, error } = useQuery({
    queryKey: ["user", session?.user.id],
    queryFn: () => (session ? fetchUser(session.user.id) : eAP),
  });

  return {
    isLoading,
    user: data?.[0],
    error,
  };
}
