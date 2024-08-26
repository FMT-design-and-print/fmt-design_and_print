import { QuoteStatus } from "@/types/quote";
import { Box, Button, Group, Notification, rem } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ReActivateQuote } from "./ReActivateQuote";

interface Props {
  status: QuoteStatus;
  numberOfReactivationRequested: number;
  quoteId: string;
  quoteNumber: string | number;
  reactivationReasons: string[];
}

export const QuoteStatusRenderer = ({
  status,
  numberOfReactivationRequested,
  quoteId,
  quoteNumber,
  reactivationReasons,
}: Props) => {
  if (status === "paid") {
    return (
      <Box py="xl">
        <Notification
          icon={<IconCheck style={{ width: rem(20), height: rem(20) }} />}
          color="blue"
          title="Quote Fulfilled"
        >
          This quote has been fulfilled and closed
        </Notification>

        <Group py="md" justify="flex-end">
          <Button size="xs">Request a New Quote</Button>
        </Group>
      </Box>
    );
  }

  if (status === "cancelled") {
    return (
      <Box py="xl">
        <Notification
          icon={<IconX style={{ width: rem(20), height: rem(20) }} />}
          color="red"
          title="Quote Cancelled"
        >
          This quote has been cancelled
        </Notification>
        <Group py="md" justify="flex-end">
          {numberOfReactivationRequested < 3 && (
            <ReActivateQuote
              quoteId={quoteId}
              quoteNumber={quoteNumber}
              reactivationReasons={reactivationReasons}
            />
          )}

          <Button size="xs">Request a New Quote</Button>
        </Group>
      </Box>
    );
  }

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
        {numberOfReactivationRequested < 3 && (
          <ReActivateQuote
            quoteId={quoteId}
            quoteNumber={quoteNumber}
            reactivationReasons={reactivationReasons}
          />
        )}
        <Button size="xs">Request a New Quote</Button>
      </Group>
    </Box>
  );
};
