/* eslint-disable camelcase */
"use client";
import { Print } from "@/components/Print";
import { calculateTotal } from "@/functions";
import { IQuote } from "@/types/quote";
import { Box, Button, Center, Group, Notification, rem } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { PrintableQuote } from "./PrintableQuote";
import { QuotePayment } from "./QuotePayment";
import { QuoteReview } from "./QuoteReview";
import { ReActivateQuote } from "./ReActivateQuote";
import { RequestRevision } from "./RequestRevision";
import Link from "next/link";

interface Props {
  quote: IQuote;
}

export const Layout = ({ quote }: Props) => {
  const {
    id,
    quoteNumber,
    title,
    items,
    created_at,
    dueDate,
    clientName,
    contact,
    email,
    requestPayment,
    reactivationReasons,
    revisionReasons,
    numberOfRevisionsRequested,
    numberOfReactivationRequested,
    order_id,
  } = quote;
  const [screen, setScreen] = useState<"review" | "payment">("review");

  const isDueDatePassed = (): boolean => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    return currentDate > dueDateObj;
  };

  if (isDueDatePassed()) {
    return (
      <Center py="xl">
        <Box py="xl">
          <Notification
            icon={<IconX style={{ width: rem(20), height: rem(20) }} />}
            color="red"
            title="Quote Expired"
          >
            This quote has expired or passed the due date
          </Notification>
          <Group py="md" justify="flex-end">
            {numberOfReactivationRequested < 3 && (
              <ReActivateQuote
                quoteId={id}
                quoteNumber={quoteNumber}
                reactivationReasons={reactivationReasons || []}
              />
            )}
            <Button size="xs" component={Link} href="/quote-or-invoice-request">
              Request a New Quote
            </Button>
          </Group>
        </Box>
      </Center>
    );
  }

  return (
    <>
      {screen === "review" && (
        <Box>
          <QuoteReview
            clientName={clientName}
            clientContact={email || contact}
            quoteNumber={quoteNumber}
            quoteTitle={title}
            createdDate={created_at}
            dueDate={dueDate}
            items={items}
            requestPayment={requestPayment}
          />
          <Group justify="space-between" py="sm">
            <Group>
              <Print>
                <PrintableQuote
                  clientName={clientName}
                  clientContact={contact}
                  quoteNumber={quoteNumber}
                  quoteTitle={title}
                  createdDate={created_at}
                  dueDate={dueDate}
                  items={items}
                />
              </Print>
              {numberOfRevisionsRequested < 3 && (
                <RequestRevision
                  quoteId={id}
                  quoteNumber={quoteNumber}
                  revisionReasons={revisionReasons || []}
                />
              )}
            </Group>

            {requestPayment && (
              <Button
                size="sm"
                className="btn"
                onClick={() => setScreen("payment")}
                w={{ base: "100%", sm: "fit-content" }}
              >
                Accept and Pay
              </Button>
            )}
          </Group>
        </Box>
      )}
      {screen === "payment" && (
        <QuotePayment
          quoteId={id}
          orderId={order_id}
          subTotal={calculateTotal(items.map((item) => item.totalAmount))}
          clientName={clientName}
          contact={contact}
          email={email}
          setScreen={setScreen}
        />
      )}
    </>
  );
};
