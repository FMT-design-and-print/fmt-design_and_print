import { IWebsiteSettings } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

// Custom hook
const useWebsiteSettings = () => {
  return useQuery({
    queryKey: ["website-settings"],
    queryFn: fetchWebsiteSettings,
    staleTime: 1000 * 60 * 5,
  });
};

export default useWebsiteSettings;
