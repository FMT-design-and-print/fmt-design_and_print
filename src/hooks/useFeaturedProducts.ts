import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { featuredProductsQuery } from "@/queries";

const fetchFeaturedProducts = async () => {
  return await client.fetch(featuredProductsQuery);
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });
};
