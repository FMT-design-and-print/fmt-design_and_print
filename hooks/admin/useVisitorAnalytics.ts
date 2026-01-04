import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Visitor {
  id: string;
  visitor_id?: string; // Client-side generated ID used for linking
  ip_address: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  user_agent: string | null;
  last_visit: string;
  visit_count?: number;
}

export interface PageView {
  id: number;
  visitor_id: string;
  url: string;
  referrer: string | null;
  created_at: string;
}

export function useVisitorAnalytics() {
  const supabase = createClient();

  // Fetch all visitors (with pagination ideally, but for now fetching recent 1000)
  const { data: visitors, isLoading: loadingVisitors } = useQuery({
    queryKey: ["admin-visitors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .order("last_visit", { ascending: false })
        .limit(1000);

      if (error) throw error;
      return data as Visitor[];
    },
  });

  // Fetch recent page views
  const { data: pageViews, isLoading: loadingPageViews } = useQuery({
    queryKey: ["admin-page-views"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (error) throw error;
      return data as unknown as PageView[];
    },
  });

  // Calculate Stats
  const stats = {
    totalVisitors: visitors?.length || 0,
    totalPageViews: pageViews?.length || 0,
    uniqueCountries: new Set(visitors?.map((v) => v.country).filter(Boolean)).size,
  };

  return {
    visitors,
    pageViews,
    stats,
    isLoading: loadingVisitors || loadingPageViews,
  };
}
