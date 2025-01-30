import { IPrintProduct } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { allProductsQuery } from "@/sanity/queries/products";
import { client } from "@/sanity/lib/client";

export function useAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const products = await client.fetch<IPrintProduct[]>(allProductsQuery);
      return products;
    },
  });
}
