import { IQuote } from "@/types/quote";
import { ICustomOrder } from "@/types/order";
import { QuoteFormValues } from "../schemas/quoteFormSchema";

const QUOTE_FIELDS_TO_COMPARE = [
  "type",
  "title",
  "clientName",
  "email",
  "contact",
  "dueDate",
  "items",
] as const;

const ORDER_FIELDS_TO_COMPARE = [
  "itemTypes",
  "contactName",
  "phone",
  "estimatedFulfillmentDate",
] as const;

type OrderDetails = {
  quoteReceptionMedium?: string;
  quoteReceptionValue?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function compareChanges(
  formValues: QuoteFormValues,
  originalQuote: IQuote,
  originalOrder: ICustomOrder & { orderDetails: OrderDetails },
  originalOrderDetails: { key: string; value: string }[]
) {
  // Compare quote fields
  const hasQuoteChanges = QUOTE_FIELDS_TO_COMPARE.some((field) => {
    if (field === "dueDate") {
      const formDate = formValues[field];
      const quoteDate = originalQuote[field];
      return formDate instanceof Date && quoteDate instanceof Date
        ? formDate.getTime() !== quoteDate.getTime()
        : true;
    }
    if (field === "items") {
      return (
        JSON.stringify(formValues[field]) !==
        JSON.stringify(originalQuote[field])
      );
    }
    return formValues[field] !== originalQuote[field];
  });

  // Compare order fields
  const hasOrderChanges = ORDER_FIELDS_TO_COMPARE.some((field) => {
    if (field === "estimatedFulfillmentDate") {
      const formDate = formValues[field];
      const orderDate = originalOrder[field];
      return formDate instanceof Date && orderDate instanceof Date
        ? formDate.getTime() !== orderDate.getTime()
        : true;
    }
    if (field === "itemTypes") {
      return (
        JSON.stringify(formValues[field]) !==
        JSON.stringify(originalOrder[field])
      );
    }
    return formValues[field] !== originalOrder[field];
  });

  // Compare order details
  const currentOrderDetails = formValues.orderDetails;
  const hasOrderDetailsChanges =
    JSON.stringify(currentOrderDetails) !==
    JSON.stringify(originalOrderDetails);

  // Compare reception details
  const hasReceptionChanges =
    formValues.receptionMedium !==
      originalOrder.orderDetails?.quoteReceptionMedium ||
    formValues.receptionValue !==
      originalOrder.orderDetails?.quoteReceptionValue;

  return {
    hasQuoteChanges,
    hasOrderChanges:
      hasOrderChanges || hasOrderDetailsChanges || hasReceptionChanges,
  };
}
