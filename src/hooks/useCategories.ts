import { useQuery } from "@tanstack/react-query";
import { client } from "../../sanity/lib/client";
import { ICategory } from "@/types";
import { filteredCategoriesByProductTypeQuery } from "@/queries";

const getCategories = async (): Promise<ICategory[]> =>
  await client.fetch(filteredCategoriesByProductTypeQuery);

export function useCategories() {
  const {
    isLoading,
    data: categories,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return {
    isLoading,
    categories,
    error,
  };
}
