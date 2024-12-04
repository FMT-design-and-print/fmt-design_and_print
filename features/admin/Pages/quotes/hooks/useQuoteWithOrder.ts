import { ICustomOrder } from "@/types/order";
import { IQuote } from "@/types/quote";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface QuoteWithOrder extends IQuote {
  "custom-orders": ICustomOrder;
}

export function useQuoteWithOrder(quoteId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["quote-with-order", quoteId],
    enabled: !!quoteId,
    queryFn: async () => {
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .select("*, custom-orders(*)")
        .eq("id", quoteId)
        .single();

      if (quoteError) throw quoteError;

      const customOrder = (quote as unknown as QuoteWithOrder)?.[
        "custom-orders"
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderDetails: any = customOrder?.orderDetails || {};

      // Extract artwork files if they exist
      const artworkFiles = orderDetails.artworks || [];
      delete orderDetails.artworks;

      // Extract reception details
      const receptionMedium = orderDetails.quoteReceptionMedium;
      const receptionValue = orderDetails.quoteReceptionValue;
      delete orderDetails.quoteReceptionMedium;
      delete orderDetails.quoteReceptionValue;

      // Convert remaining orderDetails back to array format
      const orderDetailsArray = Object.entries(orderDetails).map(
        ([key, value]) => ({
          key,
          value: String(value),
        })
      );

      return {
        quote: quote as unknown as QuoteWithOrder,
        customOrder: {
          ...customOrder,
          orderDetails: orderDetailsArray,
        },
        artworkFiles,
        artworkOption: orderDetails?.artworkOption,
        receptionMedium,
        receptionValue,
      };
    },
  });
}
