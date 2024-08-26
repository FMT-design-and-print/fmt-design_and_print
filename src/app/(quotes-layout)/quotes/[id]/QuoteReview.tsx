"use client";
import { Print } from "@/components/Print";
import {
  getFormattedDurationFromNow,
  getFormattedDurationToFuture,
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
  } = props;

  return (
    <div>
      <Group justify="space-between">
        <Title order={3} c="gray">
          #{quoteNumber}
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
              Created Date:{" "}
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
                {getFormattedDurationToFuture(new Date(dueDate))}
              </Badge>
            </Text>
          </Group>
        </Box>

        <Box className="space-y-2" pr="md">
          <Text fw="bold">To:</Text>
          <Text size="sm" c="gray">
            {clientName}
          </Text>
          <Text size="sm" c="gray">
            {clientContact}
          </Text>
        </Box>
      </Flex>

      <Box hiddenFrom="sm">
        <QuoteCards items={items} />
      </Box>

      <Box visibleFrom="sm">
        <QuoteTable items={items} />
      </Box>

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
