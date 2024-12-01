import { isEqual } from "lodash";
import { ISales, Expenses } from "@/types/sales-expenses";
import { DiscountType, PaymentMethod } from "@/types";

export function getChangedSalesFields(
  currentData: {
    productType: string;
    description: string;
    unitPrice: number;
    quantity: number;
    discount?: { type: DiscountType; value: number };
    paymentMethods: PaymentMethod[];
  },
  originalData: ISales,
  calculateTotalAmount: () => number
): Partial<ISales> {
  const changes: Partial<ISales> = {
    id: originalData.id,
    updated_at: new Date(),
  };

  if (currentData.productType !== originalData.productType) {
    changes.productType = currentData.productType;
  }
  if (currentData.description !== originalData.description) {
    changes.description = currentData.description;
  }
  if (currentData.unitPrice !== originalData.unitPrice) {
    changes.unitPrice = currentData.unitPrice;
  }
  if (currentData.quantity !== originalData.quantity) {
    changes.quantity = currentData.quantity;
  }
  if (!isEqual(currentData.paymentMethods, originalData.paymentMethods)) {
    changes.paymentMethods = currentData.paymentMethods;
  }
  if (!isEqual(currentData.discount, originalData.discount)) {
    changes.discount = currentData.discount;
  }

  if (changes.unitPrice || changes.quantity || changes.discount) {
    changes.totalAmount = calculateTotalAmount();
  }

  return changes;
}

export function getChangedExpenseFields(
  currentData: {
    description: string;
    amount: number;
    type: string;
    paymentMethods: PaymentMethod[];
    approver: string;
  },
  originalData: Expenses
): Partial<Expenses> {
  const changes: Partial<Expenses> = {
    id: originalData.id,
    updated_at: new Date(),
  };

  if (currentData.description !== originalData.description) {
    changes.description = currentData.description;
  }
  if (currentData.amount !== originalData.amount) {
    changes.amount = currentData.amount;
  }
  if (currentData.type !== originalData.type) {
    changes.type = currentData.type;
  }
  if (!isEqual(currentData.paymentMethods, originalData.paymentMethods)) {
    changes.paymentMethods = currentData.paymentMethods;
  }
  if (currentData.approver !== originalData.approver) {
    changes.approver = currentData.approver;
  }

  return changes;
}
