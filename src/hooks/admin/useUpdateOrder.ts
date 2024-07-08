import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateOrderArgs {
  orderId: string;
  update: object;
}

export const supabase = createClient();

export const updateOrder = async ({ orderId, update }: UpdateOrderArgs) => {
  const { error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: UpdateOrderArgs) => updateOrder(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "admin"] });
    },
  });
};
