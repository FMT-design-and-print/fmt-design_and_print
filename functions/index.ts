import {
  GroupedPrintProductTypes,
  ICartItem,
  ICategory,
  IOptionsErrors,
  IPrintProduct,
  IProductType,
  IShippingAddress,
  MessageStatus,
  SelectedProductOptions,
} from "@/types";
import { DeliveryType, OrderStatus } from "@/types/order";
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
  isCustomizable?: boolean;
  disableMainColor?: boolean;
  numberOfSides?: number;
  numberOfArtworks?: number;
  enableArtworkLabels?: boolean;
  artworkLabels?: string[];
  allowMultipleArtworksForEachSide?: boolean;
};
export function getProductOptionsErrors(
  options: SelectedProductOptions,
  payload?: Payload
) {
  let errors: IOptionsErrors = {};

  if (!payload?.disableMainColor && options.color == null) {
    errors = { ...errors, color: "Select color" };
  }

  if (payload?.sizes != null && payload?.sizes.length !== 0 && !options.size) {
    errors = { ...errors, size: "Select size" };
  }

  if (!options.quantity) {
    errors = { ...errors, quantity: "Select quantity" };
  }

  // Artwork validation
  if (payload?.isCustomizable) {
    // Check if we're using the multiple artworks dropzone
    if (
      (payload.numberOfSides && payload.numberOfSides > 1) ||
      (payload.numberOfArtworks !== undefined && payload.numberOfArtworks > 1)
    ) {
      // Determine how many artworks are required
      const requiredArtworkCount =
        payload.numberOfArtworks && payload.numberOfArtworks > 0
          ? payload.numberOfArtworks
          : payload.numberOfSides || 1;

      // Check if artworkFilesMap exists and has the correct number of entries with files
      if (
        !options.artworkFilesMap ||
        Object.keys(options.artworkFilesMap).length < requiredArtworkCount ||
        Object.values(options.artworkFilesMap).some(
          (files) => files.length === 0
        )
      ) {
        errors = {
          ...errors,
          artworkFiles: `Please upload artwork for all ${requiredArtworkCount} required positions`,
        };
      }
    }
    // For backward compatibility with single dropzone
    else if (
      (!options.artworkFiles || options.artworkFiles.length === 0) &&
      (!options.artworkFilesMap ||
        Object.keys(options.artworkFilesMap).length === 0)
    ) {
      errors = {
        ...errors,
        artworkFiles: "Upload artwork files for customization",
      };
    }
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

export function calculateTotal(items: number[]): number {
  return items.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

export function getRandomLength<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// generate new order number
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

export function verifyAddressDetails(
  details: IShippingAddress,
  deliveryType?: DeliveryType
) {
  const keysToCheck: (keyof IShippingAddress)[] =
    deliveryType === "delivery"
      ? ["contactName", "phone1", "address", "region", "town"]
      : ["contactName", "phone1"];

  const emptyFields = keysToCheck
    .filter((key) => !details[key])
    .map((key) => shippingAddressLabelMap(key));
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

export function generatePassword(): string {
  const possibleLengths = [6, 7, 8, 9, 10];
  const index = Math.floor(Math.random() * possibleLengths.length);
  const selectedLength = possibleLengths[index];

  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$&()_[]{}|<>?";

  const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
  let password = "";

  for (let i = 0; i < selectedLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}

export function areDatesEqual(date1: Date, date2: Date): boolean {
  if (!date1 || !date2) {
    return false;
  }

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function calculateEstimatedFulfillmentDate(
  numberOfDays: number,
  createdAt: string | Date,
  estimatedFulfillmentDate?: string | Date
): Date {
  const createdDate = new Date(createdAt);

  const fulfillmentDate = estimatedFulfillmentDate
    ? new Date(estimatedFulfillmentDate)
    : new Date(createdDate.setDate(createdDate.getDate() + numberOfDays));

  if (fulfillmentDate.getDay() === 0) {
    fulfillmentDate.setDate(fulfillmentDate.getDate() + 1);
  }

  return fulfillmentDate;
}

export const shippingAddressLabelMap = (key: keyof IShippingAddress) => {
  switch (key) {
    case "contactName":
      return "Contact Name";
    case "phone1":
      return "Phone 1";
    case "phone2":
      return "Phone 2";
    case "email":
      return "Email";
    case "address":
      return "Address";
    case "town":
      return "Town";
    case "region":
      return "Region";
    case "country":
      return "Country";
    default:
      return key;
  }
};

/**
 * Determines if a product should use the multiple artworks dropzone
 * @param product The product to check
 * @returns Boolean indicating if multiple artworks should be used
 */
export function shouldUseMultipleArtworks(product: IPrintProduct): boolean {
  if (!product.isCustomizable) {
    return false;
  }

  // Only use multiple artworks if:
  // 1. We have more than one side OR
  // 2. We have a specific number of artworks (not -1) that is greater than 1 OR
  // 3. We allow multiple artworks for each side (when number of sides > 1)
  const hasMultipleSides = !!product.numberOfSides && product.numberOfSides > 1;
  const hasMultipleArtworks =
    product.numberOfArtworks != null &&
    product.numberOfArtworks > 1 &&
    product.numberOfArtworks !== -1;
  const allowsMultipleArtworksPerSide =
    !!product.allowMultipleArtworksForEachSide &&
    !!product.numberOfSides &&
    product.numberOfSides > 1;

  return (
    hasMultipleSides || hasMultipleArtworks || allowsMultipleArtworksPerSide
  );
}

/**
 * Gets the default image for a product
 * Prioritizes: main image -> first gallery image -> first color image
 * @param product The product to get the default image for
 * @returns The default image URL
 */
export function getDefaultProductImage(product: {
  image?: string;
  gallery?: string[];
  colors?: { image: string }[] | null;
}): string {
  // First priority: Main product image
  if (product.image) {
    return product.image;
  }

  // Second priority: First gallery image
  if (product.gallery && product.gallery.length > 0) {
    return product.gallery[0];
  }

  // Third priority: First color image
  if (product.colors && product.colors.length > 0) {
    return product.colors[0].image;
  }

  // Fallback to empty string if no images are available
  return "";
}
