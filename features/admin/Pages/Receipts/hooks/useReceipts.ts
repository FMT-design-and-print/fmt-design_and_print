import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Receipt } from "@/types/receipts";
import { toast } from "react-toastify";

const supabase = createClient();

async function fetchReceipts() {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export function useReceipts() {
  const queryClient = useQueryClient();

  const {
    data: receipts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["receipts"],
    queryFn: fetchReceipts,
  });

  const deleteReceipt = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("receipts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting receipt:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete receipt. Please try again."
      );
    },
  });

  const upsertReceipt = useMutation({
    mutationFn: async (receipt: Partial<Receipt>) => {
      const { data, error } = await supabase
        .from("receipts")
        .upsert(receipt)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
    onError: (error) => {
      console.error("Error saving receipt:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save receipt. Please try again."
      );
    },
  });

  return {
    receipts,
    isLoading,
    error,
    deleteReceipt,
    upsertReceipt,
  };
}
