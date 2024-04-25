import { allProductTypesQuery } from "@/queries/product-types";
import { GroupedPrintProductTypes, IProductType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../sanity/lib/client";
import { groupProductTypesByCategory } from "@/functions";

const getProductTypes = async (): Promise<GroupedPrintProductTypes> => {
  const res: IProductType[] = await client.fetch(allProductTypesQuery);
  return groupProductTypesByCategory(res);
};

export function useGroupedProductTypes() {
  const {
    isLoading,
    data: groupedProductTypes,
    error,
  } = useQuery({
    queryKey: ["all-product-types"],
    queryFn: getProductTypes,
  });

  return {
    isLoading,
    groupedProductTypes,
    error,
  };
}
