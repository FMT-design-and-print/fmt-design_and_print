import { IQuoteItem } from "@/types/quote";
import { Box, Flex, Group, Text, Title } from "@mantine/core";
import { useQuoteDetails } from "../../QuoteTypeProvider";
import { NoteSection } from "./NoteSection";
import { QuoteTable } from "./QuoteTable";

interface PrintableQuoteProps {
  clientName?: string;
  clientContact?: string;
  quoteNumber: string | number;
  quoteTitle: string;
  createdDate: Date;
  dueDate: Date;
  items: IQuoteItem[];
  note?: {
    paymentDetails?: string;
    AdditionalInformation?: string;
    thankYou?: string;
  };
  showDueDate?: boolean;
  paymentPercentage: number;
}

export const PrintableQuote = ({
  clientName,
  clientContact,
  quoteNumber,
  quoteTitle,
  createdDate,
  dueDate,
  items,
  note,
  showDueDate,
  paymentPercentage,
}: PrintableQuoteProps) => {
  const { type } = useQuoteDetails();
  return (
    <div className="p-8">
      <Group justify="space-between">
        <Title order={3} c="gray.6">
          {type === "quote" ? "Quote-" : "Invoice-"}
          (#{quoteNumber})
        </Title>
      </Group>

      <Title order={2} py={16}>
        {quoteTitle}
      </Title>

      <Flex align="flex-start" justify="space-between" my="md">
        <Box className="space-y-2">
          <Group>
            <Text fw="bold" size="sm">
              Created Date:{" "}
            </Text>
            <Text c="gray.7" size="sm">
              {new Date(createdDate).toDateString()}
            </Text>
          </Group>

          {showDueDate && (
            <Group>
              <Text fw="bold" size="sm">
                Due date:{" "}
              </Text>
              <Text c="gray.7" size="sm">
                {new Date(dueDate).toDateString()}
              </Text>
            </Group>
          )}
        </Box>

        <Box className="space-y-2" pr="md">
          <Text fw="bold" ta="right">
            To:
          </Text>
          <Text size="sm" ta="right">
            {clientName}
          </Text>
          <Text size="sm" ta="right">
            {clientContact}
          </Text>
        </Box>
      </Flex>

      <QuoteTable items={items} paymentPercentage={paymentPercentage} />

      {note && <NoteSection note={note} />}
    </div>
  );
};
