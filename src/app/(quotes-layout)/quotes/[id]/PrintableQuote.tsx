/* eslint-disable tailwindcss/no-custom-classname */
import { FMTLogo } from "@/components/FMTLogo";
import { Box, Flex, Group, Text, Title } from "@mantine/core";
import { QuoteTable } from "./QuoteTable";
import { IQuoteItem } from "@/types/quote";

interface PrintableQuoteProps {
  clientName?: string;
  clientContact?: string;
  quoteNumber: string | number;
  quoteTitle: string;
  createdDate: Date;
  dueDate: Date;
  items: IQuoteItem[];
}

export const PrintableQuote = ({
  clientName,
  clientContact,
  quoteNumber,
  quoteTitle,
  createdDate,
  dueDate,
  items,
}: PrintableQuoteProps) => {
  return (
    <div className="p-10">
      <Title order={3} c="gray.6">
        #{quoteNumber}
      </Title>

      <Title order={3} py={16}>
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

          <Group>
            <Text fw="bold" size="sm">
              Due date:{" "}
            </Text>
            <Text c="gray.7" size="sm">
              {new Date(dueDate).toDateString()}
            </Text>
          </Group>
        </Box>

        <Box className="space-y-2" pr="md">
          <Text fw="bold">To:</Text>
          <Text size="sm">{clientName}</Text>
          <Text size="sm">{clientContact}</Text>
        </Box>
      </Flex>

      <QuoteTable items={items} />
      <Box my="xl" className="space-y-2">
        <FMTLogo image="https://res.cloudinary.com/dnbmynikp/image/upload/v1703264782/FMT/logo1_tpiges.png" />
        <Title order={3}></Title>
        <Text size="sm" c="muted">
          fmtdesignprint@gmail.com
        </Text>
        <Text size="sm" c="muted">
          +233559617959
        </Text>
      </Box>
    </div>
  );
};
