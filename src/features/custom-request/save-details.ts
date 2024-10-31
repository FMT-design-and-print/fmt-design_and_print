import { getOrderId } from "@/functions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { ICustomRequestContext } from ".";

export const saveCustomOrderDetails = async (
  requestDetails: object,
  orderDetails: object,
  context: ICustomRequestContext
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
        contactName: context.contactName,
        phone:
          context.phone ||
          (context.quoteReceptionMedium === "sms" ||
          context.quoteReceptionMedium === "whatsapp"
            ? context.quoteReceptionValue
            : ""),
        email:
          context.email ||
          (context.quoteReceptionMedium === "email"
            ? context.quoteReceptionValue
            : ""),
      },
    ])
    .select("orderId")
    .single();

  if (error) {
    toast.error("Could not add details. Please try again.");
    console.error(error);
    return { isSuccess: false, error };
  }

  toast.success("Order requested successfully. We will reach out to you soon.");
  return { isSuccess: true, data };
};
