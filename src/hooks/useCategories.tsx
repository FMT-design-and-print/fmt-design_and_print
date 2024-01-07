import { useQuery } from "@tanstack/react-query";
import { client } from "../../sanity/lib/client";
import { categoriesQuery } from "../../sanity/queries";
import { ICategory } from "@/types";

const getCategories = async (): Promise<ICategory[]> =>
  await client.fetch(categoriesQuery);

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
