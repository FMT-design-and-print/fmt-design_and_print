"use client";

import React, { createContext, useContext } from "react";

interface QuoteDetailsContextType {
  type: "quote" | "invoice";
  title: string;
  setType: (type: "quote" | "invoice") => void;
  setTitle: (title: string) => void;
}

const QuoteDetailsContext = createContext<QuoteDetailsContextType | undefined>(
  undefined
);

export function useQuoteDetails() {
  const context = useContext(QuoteDetailsContext);
  if (context === undefined) {
    throw new Error(
      "useQuoteDetails must be used within a QuoteDetailsProvider"
    );
  }
  return context;
}

export function QuoteDetailsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [type, setType] = React.useState<"quote" | "invoice">("quote");
  const [title, setTitle] = React.useState<string>(
    "Invoice - FMT Design and Print"
  );

  return (
    <QuoteDetailsContext.Provider value={{ type, title, setType, setTitle }}>
      {children}
    </QuoteDetailsContext.Provider>
  );
}
