import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { CalculatorSettings } from "../types";
import { setCalculatorSettings } from "../utils";

const supabase = createClient();

export function useSettingsUpdater() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: CalculatorSettings) => {
      const { data, error } = await supabase
        .from("price-calculator-settings")
        .update(settings)
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      // Refetch settings and update local state
      const { data } = await supabase
        .from("price-calculator-settings")
        .select("*")
        .eq("active", true);

      if (data) {
        setCalculatorSettings(data);
        queryClient.setQueryData(["calculator-settings"], data);
      }
    },
  });
}
