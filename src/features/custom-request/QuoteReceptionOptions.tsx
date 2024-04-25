import { Button, Card, Group, Input, Radio, Stack, Text } from "@mantine/core";
import { useCustomRequest } from ".";
import { QuoteReceptionMedium } from "@/types";

interface Props {
  handleReceiveQuote: () => void;
}
export const QuoteReceptionOptions = ({ handleReceiveQuote }: Props) => {
  const context = useCustomRequest();

  const inputLabel =
    context?.quoteReceptionMedium === "email"
      ? "Email address"
      : context?.quoteReceptionMedium === "whatsapp"
        ? "Active Whatsapp number"
        : "Phone number to receive SMS";

  return (
    <Card withBorder>
      <Text size="sm" c="dimmed" mb="lg">
        How do you want to receive your quote?
      </Text>
      <Group justify="space-between">
        <Stack gap={16}>
          <Radio.Group
            defaultValue="email"
            value={context?.quoteReceptionMedium}
            onChange={(value) => {
              context?.setQuoteReceptionValue("");
              context?.setQuoteReceptionMedium(value as QuoteReceptionMedium);
            }}
          >
            <Group>
              <Radio value="email" label="Email" color="pink" />
              <Radio value="whatsapp" label="Whatsapp" color="pink" />
              <Radio value="sms" label="SMS" color="pink" />
            </Group>
          </Radio.Group>

          <Input
            value={context?.quoteReceptionValue}
            onChange={(e) =>
              context?.setQuoteReceptionValue(e.currentTarget.value)
            }
            placeholder={inputLabel}
          />
        </Stack>

        <Button className="btn" onClick={handleReceiveQuote}>
          Receive Quote
        </Button>
      </Group>
    </Card>
  );
};
