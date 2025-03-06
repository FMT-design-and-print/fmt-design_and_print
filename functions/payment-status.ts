import { PaymentStatus } from "@/types/order";

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return "green";
    case "partly-paid":
      return "yellow";
    case "unpaid":
    case "failed":
      return "red";
    default:
      return "gray";
  }
};
