import { ICustomOrder, OrderStatus } from "@/types/order";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface PaymentStatusResult {
  quoteStatus: "active" | "paid";
  remainingPercentage: number;
  isInitialPayment: boolean;
  paymentStatus: "unpaid" | "partly-paid" | "paid";
  orderStatus: OrderStatus;
}

interface UseOrderDetailsReturn {
  orderDetails: Partial<ICustomOrder> | null;
  isLoading: boolean;
  error: Error | null;
  calculatePaymentStatus: (
    paymentAmount: number,
    quoteAmount: number,
    paymentPercentage: number
  ) => PaymentStatusResult;
}

export function useOrderDetails(orderId: string): UseOrderDetailsReturn {
  const supabase = createClient();

  const {
    data: orderDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom-orders")
        .select("id, totalAmount, amountPaid, status, estimatedFulfillmentDate")
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const calculatePaymentStatus = (
    paymentAmount: number,
    quoteAmount: number,
    paymentPercentage: number
  ): PaymentStatusResult => {
    const currentAmountPaid = orderDetails?.amountPaid || 0;
    const totalPaidAfterPayment = currentAmountPaid + paymentAmount;
    const expectedInitialPayment = (quoteAmount * paymentPercentage) / 100;

    // Check if this is the initial payment
    const isInitialPayment = currentAmountPaid === 0;

    // Calculate the percentage of total amount that will be paid after this payment
    const percentagePaidAfterPayment =
      (totalPaidAfterPayment / quoteAmount) * 100;
    const remainingPercentage = 100 - percentagePaidAfterPayment;

    // Determine the new status
    let quoteStatus: "active" | "paid" = "active";
    let paymentStatus: "unpaid" | "partly-paid" | "paid" = "unpaid";
    let orderStatus: OrderStatus =
      (orderDetails?.status as OrderStatus) || "requested";

    if (isInitialPayment && paymentAmount >= expectedInitialPayment) {
      // If this is initial payment and meets the required percentage
      quoteStatus = "active";
      paymentStatus = paymentAmount >= quoteAmount ? "paid" : "partly-paid";
      orderStatus = "placed";
    } else if (totalPaidAfterPayment >= quoteAmount) {
      // If total paid equals or exceeds quote amount
      quoteStatus = "paid";
      paymentStatus = "paid";
    } else if (totalPaidAfterPayment > 0) {
      // If some payment has been made but not complete
      paymentStatus = "partly-paid";
      orderStatus = orderDetails?.status as OrderStatus;
    }

    return {
      quoteStatus,
      remainingPercentage,
      isInitialPayment,
      paymentStatus,
      orderStatus,
    };
  };

  return {
    orderDetails: orderDetails || null,
    isLoading,
    error: error as Error | null,
    calculatePaymentStatus,
  };
}
