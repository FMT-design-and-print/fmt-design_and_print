import { useQuery } from "@tanstack/react-query";
import { IQuote, QuoteStatus } from "@/types/quote";
import { SortingState } from "@tanstack/react-table";
import { createClient } from "@/utils/supabase/client";
import { useMemo } from "react";

interface UseQuotesParams {
  search?: string;
  status?: QuoteStatus;
  sorting?: SortingState;
  page?: number;
  pageSize?: number;
}

const supabase = createClient();

export function useQuotes({
  search,
  status,
  sorting,
  page = 1,
  pageSize = 10,
}: UseQuotesParams = {}) {
  const { data: allQuotes, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as IQuote[];
    },
  });

  const filteredAndSortedQuotes = useMemo(() => {
    if (!allQuotes) return { data: [], totalPages: 0 };

    let filtered = [...allQuotes];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (quote) =>
          quote.title.toLowerCase().includes(searchLower) ||
          quote.clientName?.toLowerCase().includes(searchLower) ||
          quote.quoteNumber.toString().includes(searchLower)
      );
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter((quote) => quote.status === status);
    }

    // Apply sorting
    if (sorting?.length) {
      const { id, desc } = sorting[0];
      filtered.sort((a, b) => {
        const aValue = a[id as keyof IQuote];
        const bValue = b[id as keyof IQuote];
        const modifier = desc ? -1 : 1;

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
      });
    } else {
      // Default sort by creation date in descending order
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    // Apply pagination
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedData = filtered.slice(start, start + pageSize);

    return {
      data: paginatedData,
      totalPages,
    };
  }, [allQuotes, search, status, sorting, page, pageSize]);

  return {
    data: filteredAndSortedQuotes,
    isLoading,
    refetch: useQuery({
      queryKey: ["quotes"],
    }).refetch,
  };
}
