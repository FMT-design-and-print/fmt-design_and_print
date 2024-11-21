import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateOrderArgs {
  orderId: string;
  update: object;
}

export const supabase = createClient();

export const updateOrder = async (
  { orderId, update }: UpdateOrderArgs,
  tableName: "orders" | "custom-orders"
) => {
  const { error } = await supabase
    .from(tableName)
    .update(update)
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: UpdateOrderArgs) => updateOrder(args, "orders"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "admin"] });
    },
  });
};

export const useUpdateCustomOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: UpdateOrderArgs) => updateOrder(args, "custom-orders"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-orders", "admin"] });
    },
  });
};
