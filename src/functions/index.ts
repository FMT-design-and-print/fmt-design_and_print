import { GroupedPrintProductTypes, IProductType, MessageStatus } from "@/types";
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
