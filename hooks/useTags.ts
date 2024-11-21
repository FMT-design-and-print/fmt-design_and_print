import { useQuery } from "@tanstack/react-query";
import { ITags } from "@/types";
import { tagsQuery } from "@/sanity/queries/tags";
import { client } from "@/sanity/lib/client";

const getTags = async (): Promise<ITags> => await client.fetch(tagsQuery);

export function useTags() {
  const {
    isLoading,
    data: tags,
    error,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  return {
    isLoading,
    tags,
    error,
  };
}
