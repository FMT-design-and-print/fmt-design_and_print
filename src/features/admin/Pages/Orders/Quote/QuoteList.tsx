import { useQuotesByOrderId } from "@/hooks/admin/useQuotesByOrderId";
import { IQuote } from "@/types/quote";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  CopyButton,
  Group,
  Loader,
  Title,
} from "@mantine/core";
import { QuoteStatusRenderer } from "./QuoteStatusRenderer";
import { QuoteMenu } from "./QuoteMenu";
import { IconCheck, IconCopy, IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";

interface Props {
  orderId: string;
  handleEditQuote: (quote: IQuote) => void;
}
export const QuoteList = ({ orderId, handleEditQuote }: Props) => {
  const { quotes, isLoading, error } = useQuotesByOrderId(orderId);

  if (error) {
    return <Alert color="red">Error loading quotes</Alert>;
  }

  if (isLoading) {
    return <Loader variant="bars" color="pink" />;
  }

  if (quotes?.length === 0) {
    return <Alert>No quotes found</Alert>;
  }

  return (
    <>
      {quotes?.map((quote) => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          handleEditQuote={handleEditQuote}
        />
      ))}
    </>
  );
};

interface QuoteCardProps {
  quote: IQuote;
  handleEditQuote: (quote: IQuote) => void;
}

const QuoteCard = ({ quote, handleEditQuote }: QuoteCardProps) => {
  return (
    <Card shadow="xs" p="sm" my="sm" radius="sm" withBorder>
      <Group justify="space-between">
        <Box>
          <Title order={5} mb="sm">
            {quote.title}
          </Title>
          <Group>
            <QuoteStatusRenderer status={quote.status} />
            {quote.status === "active" && (
              <Group gap={4}>
                <CopyButton
                  value={window.location.origin + "/quotes/" + quote.id}
                  timeout={2000}
                >
                  {({ copied, copy }) => (
                    <Button
                      px="xs"
                      size="xs"
                      title="Copy link to quote"
                      variant="subtle"
                      color={copied ? "green" : "gray"}
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck size="1rem" />
                      ) : (
                        <IconCopy size="1rem" />
                      )}
                    </Button>
                  )}
                </CopyButton>
                <ActionIcon
                  component={Link}
                  variant="subtle"
                  color="pink.4"
                  href={"/quotes/" + quote.id}
                  target="_blank"
                >
                  <IconExternalLink size="1rem" />
                </ActionIcon>
              </Group>
            )}
          </Group>
        </Box>

        <QuoteMenu
          quoteId={quote.id}
          orderId={quote.order_id}
          status={quote.status}
          editQuote={() => handleEditQuote(quote)}
        />
      </Group>
    </Card>
  );
};
