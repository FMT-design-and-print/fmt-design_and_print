"use client";

import { useQuoteDetails } from "../../QuoteTypeProvider";
import { useEffect } from "react";

interface QuoteTypeUpdaterProps {
  type: "quote" | "invoice";
  title: string;
}

export function QuoteTypeUpdater({ type, title }: QuoteTypeUpdaterProps) {
  const { setType, setTitle } = useQuoteDetails();

  useEffect(() => {
    setType(type);
    setTitle(title);
  }, [type, setType, setTitle, title]);

  return null;
}
