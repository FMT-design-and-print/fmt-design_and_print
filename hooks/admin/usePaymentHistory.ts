import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { IPaymentHistory } from "@/types/sales-expenses";
import { toast } from "react-toastify";

export const usePaymentHistory = (customerId?: string) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["payment-history", customerId],
    queryFn: async () => {
      let q = supabase
        .from("payment_history")
        .select("*")
        .eq("isDeleted", false)
        .order("payment_date", { ascending: false });

      if (customerId) {
        q = q.eq("customer_id", customerId);
      }

      const { data, error } = await q;

      if (error) {
        console.error("Error fetching payment history:", error);
        throw error;
      }
      return data as IPaymentHistory[];
    },
    enabled: !!customerId,
  });

  const recordPaymentMutation = useMutation({
    mutationFn: async (payment: Partial<IPaymentHistory>) => {
      const { data, error } = await supabase
        .from("payment_history")
        .insert([payment])
        .select()
        .single();

      if (error) throw error;

      // Update customer total debt and total spent automatically via RPC or trigger in future, 
      // but for now we can do it via a quick client-side update if needed
      
      return data as IPaymentHistory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Payment recorded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record payment");
    },
  });

  return {
    ...query,
    recordPayment: recordPaymentMutation.mutateAsync,
    isRecording: recordPaymentMutation.isPending,
  };
};
