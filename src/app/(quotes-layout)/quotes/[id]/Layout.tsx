/* eslint-disable camelcase */
"use client";
import { Print } from "@/components/Print";
import { Box, Button, Group, Notification, rem } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { PrintableQuote } from "./PrintableQuote";
import { QuoteReview } from "./QuoteReview";
import { ReActivateQuote } from "./ReActivateQuote";
import { QuotePayment } from "./QuotePayment";
import { calculateTotal } from "@/functions";
import { RequestRevision } from "./RequestRevision";
import { IQuote } from "@/types/quote";

// TODO:
// track number of reactivation request
// track number of revision request
// record client name and contact from custom request

// revision notification
// reactivation notification

// request quote page

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
    numberOfRevisionsRequested,
  } = quote;
  const [screen, setScreen] = useState<"review" | "payment">("review");

  const isDueDatePassed = (): boolean => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    return currentDate > dueDateObj;
  };

  if (isDueDatePassed()) {
    return (
      <Box py="xl">
        <Notification
          icon={<IconX style={{ width: rem(20), height: rem(20) }} />}
          color="red"
          title="Quote Expired"
        >
          This quote has expired or passed the due date
        </Notification>
        <Group py="md" justify="flex-end">
          <ReActivateQuote />
          <Button size="xs">Request a New Quote</Button>
        </Group>
      </Box>
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
                <RequestRevision quoteId={id} />
              )}
            </Group>

            {requestPayment && (
              <Button
                size="sm"
                className="btn"
                onClick={() => setScreen("payment")}
              >
                Accept and Pay
              </Button>
            )}
          </Group>
        </Box>
      )}
      {screen === "payment" && (
        <Box>
          <QuotePayment
            quoteId={id}
            subTotal={calculateTotal(items.map((item) => item.totalAmount))}
            clientName={clientName}
            contact={contact}
            email={email}
          />
          <Group justify="space-between" py="sm">
            <Button
              variant="outline"
              onClick={() => setScreen("review")}
              leftSection={<BsArrowLeft />}
            >
              Review Items
            </Button>
          </Group>
        </Box>
      )}
    </>
  );
};
