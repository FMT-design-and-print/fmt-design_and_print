import { removeDuplicateCategories } from "@/functions";
import { client } from "@/sanity/lib/client";
import { filteredCategoriesByProductTypeQuery } from "@/sanity/queries";
import { ICategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

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
