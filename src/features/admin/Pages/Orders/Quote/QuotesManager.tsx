import { Divider, Title } from "@mantine/core";
import React, { useState } from "react";
import { QuoteList } from "./QuoteList";
import { CreateOrEditQuote } from "./CreateOrEditQuote";
import { ICustomOrder } from "@/types/order";
import { QuoteFormMode } from "./types";
import { IQuote } from "@/types/quote";

interface Props {
  order: ICustomOrder;
}

export const QuotesManager = ({ order }: Props) => {
  const [mode, setMode] = useState<QuoteFormMode>("create");
  const [quote, setQuote] = useState<IQuote | null>(null);

  return (
    <div>
      <Title order={3}>Quotes</Title>
      <Divider my="sm" />
      <QuoteList
        orderId={order.id}
        handleEditQuote={(data) => {
          setMode("edit");
          setQuote(data);
        }}
      />

      <CreateOrEditQuote
        orderId={order.id}
        contactName={order.contactName || ""}
        email={order.email || ""}
        phone={order.phone || ""}
        mode={mode}
        data={quote}
        setMode={setMode}
        setData={setQuote}
      />
    </div>
  );
};
