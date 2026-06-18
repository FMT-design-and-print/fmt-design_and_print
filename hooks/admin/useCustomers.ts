import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { ICustomer } from "@/types/sales-expenses";
import { toast } from "react-toastify";
import { useActivityLogger } from "./useActivityLogger";

export const useCustomers = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();

  const query = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("isDeleted", false)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching customers:", error);
        throw error;
      }
      return data as ICustomer[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCustomer: Partial<ICustomer>) => {
      const { data, error } = await supabase
        .from("customers")
        .insert([newCustomer])
        .select()
        .single();

      if (error) throw error;
      
      logActivity({
        action: "CREATE",
        entity_type: "CUSTOMER",
        entity_id: data.id,
        description: `Created customer: ${data.name}`,
      });
      
      return data as ICustomer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create customer");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedCustomer: Partial<ICustomer> & { id: string }) => {
      const { data, error } = await supabase
        .from("customers")
        .update(updatedCustomer)
        .eq("id", updatedCustomer.id)
        .select()
        .single();

      if (error) throw error;
      
      logActivity({
        action: "UPDATE",
        entity_type: "CUSTOMER",
        entity_id: data.id,
        description: `Updated customer: ${data.name}`,
      });
      
      return data as ICustomer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update customer");
      console.error(error);
    },
  });

  return {
    ...query,
    createCustomer: createMutation.mutateAsync,
    updateCustomer: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
