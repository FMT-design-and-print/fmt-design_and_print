import { useQuery } from "@tanstack/react-query";
import { IQuote } from "@/types/quote";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as IQuote;
    },
    enabled: !!id,
  });
}
