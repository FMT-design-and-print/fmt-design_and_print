import {
  GroupedPrintProductTypes,
  ICartItem,
  ICategory,
  IOptionsErrors,
  IProductType,
  IShippingAddress,
  MessageStatus,
  SelectedProductOptions,
} from "@/types";
import { DefaultMantineColor } from "@mantine/core";

export const getAlertColor = (
  messageStatus?: MessageStatus
): {
  bgColor: DefaultMantineColor;
  textColor: string;
} => {
  switch (messageStatus) {
    case "success":
      return { bgColor: "green", textColor: "text-green-700" };
    case "error":
      return { bgColor: "red", textColor: "text-red-700" };
    case "info":
      return { bgColor: "blue", textColor: "text-blue-700" };
    default:
      return { bgColor: "gray", textColor: "text-gray-700" };
  }
};

export function groupProductTypesByCategory(arr: IProductType[]) {
  return arr.reduce((acc: GroupedPrintProductTypes, productType) => {
    const groupKey = productType.category.id;

    if (!acc[groupKey]) {
      acc[groupKey] = {
        title: productType.category.title,
        slug: productType.category.slug,
        items: [],
      };
    }

    acc[groupKey].items.push(productType);

    return acc;
  }, {});
}

type Payload = {
  sizes?: string[] | null;
};
export function getProductOptionsErrors(
  options: SelectedProductOptions,
  payload?: Payload
) {
  let errors: IOptionsErrors = {};

  if (options.color == null) {
    errors = { ...errors, color: "Select color" };
  }

  if (payload?.sizes != null && payload?.sizes.length !== 0 && !options.size) {
    errors = { ...errors, size: "Select size" };
  }

  if (!options.quantity) {
    errors = { ...errors, quantity: "Choose quantity" };
  }

  return errors;
}

export function calculateTotalPrice(cart: ICartItem[]): number {
  let totalPrice = 0;

  for (const item of cart) {
    totalPrice += item.price * item.quantity;
  }

  return totalPrice;
}

export function getOrderId(length = 8): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const orderIdArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderIdArray.push(characters.charAt(randomIndex));
  }

  return orderIdArray.join("");
}

export function removeDuplicateCategories(
  inputArray: ICategory[]
): ICategory[] {
  const uniqueObjects: { [key: string]: ICategory } = {};

  inputArray.forEach((obj) => {
    uniqueObjects[obj.id] = obj;
  });

  const resultArray: ICategory[] = Object.values(uniqueObjects);
  return resultArray;
}

export function verifyAddressDetails(details: IShippingAddress) {
  const keysToCheck: (keyof IShippingAddress)[] = [
    "contactName",
    "phone1",
    "address",
    "region",
    "town",
  ];

  const emptyFields = keysToCheck.filter((key) => !details[key]);
  const isValid = emptyFields.length === 0;

  return {
    isValid,
    fields: emptyFields,
  };
}
