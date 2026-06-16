import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { ICustomProductType } from "@/types/sales-expenses";
import { toast } from "react-toastify";

export const useCustomProductTypes = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["custom-product-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_types")
        .select("*")
        .eq("isDeleted", false)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching custom product types:", error);
        throw error;
      }
      return data as ICustomProductType[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newType: Partial<ICustomProductType>) => {
      const { data, error } = await supabase
        .from("product_types")
        .insert([newType])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
            throw new Error("A product type with this name already exists.");
        }
        throw error;
      }
      return data as ICustomProductType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-product-types"] });
      toast.success("Product type created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product type");
    },
  });

  const createBulkMutation = useMutation({
    mutationFn: async (newTypes: Partial<ICustomProductType>[]) => {
      const { data, error } = await supabase
        .from("product_types")
        .insert(newTypes)
        .select();

      if (error) {
        throw error;
      }
      return data as ICustomProductType[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-product-types"] });
      toast.success("Product types created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product types");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedType: Partial<ICustomProductType> & { id: string }) => {
      const { data, error } = await supabase
        .from("product_types")
        .update(updatedType)
        .eq("id", updatedType.id)
        .select()
        .single();

      if (error) throw error;
      return data as ICustomProductType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-product-types"] });
      toast.success("Product type updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update product type");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, deletedBy }: { id: string, deletedBy: any }) => {
      const { error } = await supabase
        .from("product_types")
        .update({ 
            isDeleted: true,
            updatedBy: deletedBy
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-product-types"] });
      toast.success("Product type deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete product type");
      console.error(error);
    },
  });

  return {
    ...query,
    createProductType: createMutation.mutateAsync,
    createBulkProductTypes: createBulkMutation.mutateAsync,
    updateProductType: updateMutation.mutateAsync,
    deleteProductType: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending || createBulkMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
