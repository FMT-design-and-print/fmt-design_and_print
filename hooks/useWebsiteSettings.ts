import { IWebsiteSettings } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useQuery, QueryClient } from "@tanstack/react-query";

const supabase = createClient();

const fetchWebsiteSettings = async () => {
  const { data, error } = await supabase
    .from("website-settings")
    .select("*")
    .returns<IWebsiteSettings[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Prefetch function that can be used in pages that need the settings
export const prefetchWebsiteSettings = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: ["website-settings"],
    queryFn: fetchWebsiteSettings,
  });
};

// Custom hook
const useWebsiteSettings = () => {
  return useQuery({
    queryKey: ["website-settings"],
    queryFn: fetchWebsiteSettings,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes (formerly cacheTime)
  });
};

export default useWebsiteSettings;
