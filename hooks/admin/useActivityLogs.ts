import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { IActivityLog } from "@/types/admin";

export const useActivityLogs = (limit: number = 50) => {
  const supabase = createClient();

  return useQuery({
    queryKey: ["activity-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching activity logs:", error);
        throw error;
      }

      return data as IActivityLog[];
    },
  });
};
