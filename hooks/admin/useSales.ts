import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ISales } from "@/types/sales-expenses";

const supabase = createClient();

export const useSales = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel("sales-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["sales"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return useQuery<ISales[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
