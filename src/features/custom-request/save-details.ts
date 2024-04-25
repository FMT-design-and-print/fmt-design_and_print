import { getOrderId } from "@/functions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export const saveCustomOrderDetails = async (
  requestDetails: object,
  orderDetails: object,
  context: any
) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("custom-orders")
    .insert([
      {
        ...requestDetails,
        orderId: getOrderId(),
        status: "requested",
        orderDetails: {
          ...orderDetails,
          quantity: context?.quantity,
          artworkOption: context?.selectedArtworkOption,
          quoteReceptionMedium: context?.quoteReceptionMedium,
          quoteReceptionValue: context?.quoteReceptionValue,
          instructions: context?.designInstructions,
        },
      },
    ])
    .select("orderId")
    .single();

  if (error) {
    toast.error("Could not add details. Please try again.");
    return { isSuccess: false, error };
  }

  toast.success("Order requested successfully. We will reach out to you soon.");
  return { isSuccess: true, data };
};
