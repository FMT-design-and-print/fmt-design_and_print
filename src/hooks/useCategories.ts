import { useQuery } from "@tanstack/react-query";
import { client } from "../../sanity/lib/client";
import { ICategory } from "@/types";
import { filteredCategoriesByProductTypeQuery } from "@/queries";
import { removeDuplicateCategories } from "@/functions";

const getCategories = async (): Promise<ICategory[]> => {
  const res: ICategory[] = await client.fetch(
    filteredCategoriesByProductTypeQuery
  );
  return removeDuplicateCategories(res);
};

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
