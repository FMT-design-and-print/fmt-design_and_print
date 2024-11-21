import { customRequestProductTypesQuery } from "@/sanity/queries/product-types";
import { GroupedPrintProductTypes, IProductType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/sanity/lib/client";
import { groupProductTypesByCategory } from "@/functions";

const getProductTypes = async (): Promise<IProductType[]> => {
  const res: IProductType[] = await client.fetch(
    customRequestProductTypesQuery
  );
  return res;
};

const getGroupedProductTypes = async (): Promise<GroupedPrintProductTypes> => {
  const res: IProductType[] = await getProductTypes();
  return groupProductTypesByCategory(res);
};

export function useGroupedProductTypes() {
  const {
    isLoading,
    data: groupedProductTypes,
    error,
  } = useQuery({
    queryKey: ["all-grouped-product-types"],
    queryFn: getGroupedProductTypes,
  });

  return {
    isLoading,
    groupedProductTypes,
    error,
  };
}

export function useProductTypes() {
  const {
    isLoading,
    data: productTypes,
    error,
  } = useQuery({
    queryKey: ["all-product-types"],
    queryFn: getProductTypes,
  });

  return {
    isLoading,
    productTypes,
    error,
  };
}
