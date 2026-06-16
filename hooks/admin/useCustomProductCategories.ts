import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { ICustomProductCategory } from "@/types/sales-expenses";
import { toast } from "react-toastify";

export const useCustomProductCategories = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["custom-product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("isDeleted", false)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching product categories:", error);
        throw error;
      }
      return data as ICustomProductCategory[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCategory: Partial<ICustomProductCategory>) => {
      const { data, error } = await supabase
        .from("product_categories")
        .insert([newCategory])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
            throw new Error("A category with this name already exists.");
        }
        throw error;
      }
      return data as ICustomProductCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-product-categories"] });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedCategory: Partial<ICustomProductCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from("product_categories")
        .update(updatedCategory)
        .eq("id", updatedCategory.id)
        .select()
        .single();

      if (error) throw error;
      return data as ICustomProductCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-product-categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update category");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, deletedBy }: { id: string, deletedBy: any }) => {
      const { error } = await supabase
        .from("product_categories")
        .update({ 
            isDeleted: true,
            updatedBy: deletedBy
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-product-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete category");
      console.error(error);
    },
  });

  return {
    ...query,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
