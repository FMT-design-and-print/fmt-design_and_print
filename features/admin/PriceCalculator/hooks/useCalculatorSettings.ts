import { useQuery } from "@tanstack/react-query";

import { CalculatorSettings } from "../types";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useCalculatorSettings() {
  return useQuery({
    queryKey: ["calculator-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price-calculator-settings")
        .select("*")
        .eq("active", true);

      if (error) {
        throw error;
      }

      return data as CalculatorSettings[];
    },
  });
}
