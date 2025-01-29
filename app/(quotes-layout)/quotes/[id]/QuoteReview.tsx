"use client";
import { Print } from "@/components/Print";
import {
  getFormattedDaysToFuture,
  getFormattedDurationFromNow,
} from "@/functions/durations";
import { IQuoteItem } from "@/types/quote";
import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Group,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
import { FaPrint } from "react-icons/fa6";
import { useQuoteDetails } from "../../QuoteTypeProvider";
import { NoteSection } from "./NoteSection";
import { PrintableQuote } from "./PrintableQuote";
import { QuoteCards } from "./QuoteCards";
import { QuoteTable } from "./QuoteTable";

interface Props {
  clientName?: string;
  clientContact?: string;
  quoteNumber: string | number;
  quoteTitle: string;
  createdDate: Date;
  dueDate: Date;
  items: IQuoteItem[];
  requestPayment: boolean;
  note?: {
    paymentDetails?: string;
    AdditionalInformation?: string;
    thankYou?: string;
  };
  showDueDate?: boolean;
  paymentPercentage: number;
}

export const QuoteReview: FC<Props> = (props) => {
  const {
    clientName,
    clientContact,
    quoteNumber,
    quoteTitle,
    createdDate,
    dueDate,
    items,
    requestPayment,
    note,
    showDueDate,
    paymentPercentage,
  } = props;

  const { type } = useQuoteDetails();

  return (
    <div>
      <Group justify="space-between">
        <Title order={3} c="gray">
          {type === "quote" ? "Quote-" : "Invoice-"}
          (#{quoteNumber})
        </Title>
        <Print
          triggerBtn={
            <ActionIcon variant="light" color="pink">
              <FaPrint />
            </ActionIcon>
          }
        >
          <PrintableQuote
            clientName={clientName}
            clientContact={clientContact}
            quoteNumber={quoteNumber}
            quoteTitle={quoteTitle}
            createdDate={createdDate}
            dueDate={dueDate}
            items={items}
            note={note}
            paymentPercentage={paymentPercentage}
          />
        </Print>
      </Group>
      <Title order={3} py={16}>
        {quoteTitle}
      </Title>
      <Flex
        align="flex-start"
        justify="space-between"
        my="md"
        wrap="wrap"
        direction={{ base: "column", sm: "row" }}
        gap="md"
      >
        <Box className="space-y-2">
          <Group>
            <Text fw="bold" size="sm">
              Date:{" "}
            </Text>
            <Text c="gray.7" size="sm">
              {new Date(createdDate).toDateString()}
              <Badge
                component="span"
                size="xs"
                mx="sm"
                variant="light"
                color="gray"
              >
                {getFormattedDurationFromNow(new Date(createdDate))}
              </Badge>
            </Text>
          </Group>

          {showDueDate && (
            <Group>
              <Text fw="bold" size="sm">
                Due date:{" "}
              </Text>
              <Text c="gray.7" size="sm">
                {new Date(dueDate).toDateString()}
                <Badge
                  component="span"
                  size="xs"
                  mx="sm"
                  variant="light"
                  color="gray"
                >
                  {getFormattedDaysToFuture(new Date(dueDate))}
                </Badge>
              </Text>
            </Group>
          )}
        </Box>

        <Box className="space-y-2" pr="md">
          <Text fw="bold" ta="right">
            To:
          </Text>
          <Text size="sm" c="gray.8" ta="right">
            {clientName}
          </Text>
          <Text size="sm" c="gray" ta="right">
            {clientContact}
          </Text>
        </Box>
      </Flex>

      <Box hiddenFrom="sm" mt="xl">
        <QuoteCards items={items} paymentPercentage={paymentPercentage} />
      </Box>

      <Box visibleFrom="sm" mt="xl">
        <QuoteTable items={items} paymentPercentage={paymentPercentage} />
      </Box>

      {note && <NoteSection note={note} />}

      {requestPayment && (
        <Box my="lg" className="space-y-2">
          <Text size="xs">
            By accepting a quote or making payment, you acknowledge that you
            have read, understood, and agree to our{" "}
            <Link href="/terms-and-conditions" className="text-pink-600">
              Terms and Conditions
            </Link>
          </Text>
        </Box>
      )}
    </div>
  );
};
