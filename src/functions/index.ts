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
import { OrderStatus } from "@/types/order";
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

export function getRandomLength<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function getOrderId(): string {
  const characters = "0123456789";

  const length = getRandomLength([5, 6, 7, 8]);
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

export const areAllDigits = (s: string) => {
  return /^\d+$/.test(s);
};

export const areAllowedOrderNumbers = (orderNumbers: string[]) =>
  orderNumbers.every(
    (number) => areAllDigits(number) && number.length >= 5 && number.length <= 8
  );

export const getOrderCompletedDate = (completedAt?: Date) => {
  return completedAt
    ? `${new Date(completedAt).toDateString()}, ${new Date(
        completedAt
      ).toLocaleTimeString()}`
    : "an Unspecified Date";
};

export const getOrderStatusText = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "Awaiting Confirmation";
    case "processing":
      return "Processing";
    case "placed":
      return "Confirmed";
    case "shipped":
      return "On the way";
    case "delivered":
      return "Delivered";
    case "packaging":
      return "Preparing for pickup";
    case "ready":
      return "Ready for Pickup";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "pending-cancellation":
      return "Awaiting Cancellation";
    case "requested":
      return "Requested";
    default:
      return status;
  }
};

export function formatString(input: string) {
  // Remove leading and trailing whitespaces and convert to lowercase
  input = input.trim().toLowerCase();

  // Split the input string by spaces, hyphens, or commas
  const words = input.split(/[ ,-]+/);

  // Capitalize the first letter of each word
  const formattedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the formatted words with a space
  const output = formattedWords.join(" ");

  return output;
}

export function formatCamelCase(input: string): string {
  let result = "";

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);

    // Check if the character is uppercase and not the first character
    if (char === char.toUpperCase() && i > 0) {
      // Add space before the uppercase character
      result += " ";
    }

    // Append the current character to the result
    result += char;
  }

  return result;
}

export function bytesToMB(bytes: number) {
  // 1 MB = 1024 * 1024 bytes
  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(2) + "MB";
}

export function isLink(str: string): boolean {
  // Regular expression pattern to match URLs
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  // Test the string against the URL pattern
  return urlPattern.test(str);
}
