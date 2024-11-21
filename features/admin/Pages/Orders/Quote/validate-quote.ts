import { IQuoteItem, QuoteErrors } from "@/types/quote";

export function validateQuote(
  quoteTitle: string,
  quoteNumber: number,
  quoteItems: IQuoteItem[]
): { errors: QuoteErrors; hasErrors: boolean } {
  const errors: QuoteErrors = { items: {} };

  if (!quoteTitle.trim()) {
    errors.title = "required";
  }

  if (!quoteNumber.toString().trim() || quoteNumber <= 0) {
    errors.number = "must be greater than 0";
  }

  quoteItems.forEach((item, index) => {
    errors.items[index] = {};

    if (!item.description.trim()) {
      errors.items[index].description = "required";
    }
    if (item.quantity <= 0) {
      errors.items[index].quantity = "must be greater than 0";
    }
    if (item.unitPrice <= 0) {
      errors.items[index].unitPrice = "must be greater than 0";
    }
  });

  const hasErrors =
    errors.title != null ||
    Object.values(errors.items).some(
      (itemErrors) => Object.keys(itemErrors).length > 0
    );

  return { errors, hasErrors };
}
