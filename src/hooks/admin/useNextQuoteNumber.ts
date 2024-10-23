import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export const useNextQuoteNumber = () => {
  const [nextQuoteNumber, setNextQuoteNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuoteNumbers = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error } = await supabase
          .from("quotes")
          .select("quoteNumber")
          .returns<{ quoteNumber: number }[]>();

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const quoteNumbers = data.map(
            (quote: { quoteNumber: number }) => quote.quoteNumber
          );
          const highestQuoteNumber = Math.max(...quoteNumbers);

          setNextQuoteNumber(highestQuoteNumber + 1);
        } else {
          setNextQuoteNumber(1);
        }
      } catch (err: any) {
        console.error("Error fetching quote numbers:", err);
        // TODO: Send error to sentry
        setError("Failed to fetch quote numbers");
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteNumbers();
  }, []);

  return { nextQuoteNumber, loading, error };
};
