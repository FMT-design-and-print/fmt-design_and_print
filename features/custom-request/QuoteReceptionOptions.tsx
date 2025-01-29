import {
  Button,
  Card,
  Flex,
  Group,
  Input,
  Radio,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useCustomRequest } from ".";
import { QuoteReceptionMedium } from "@/types";

// TODO: Record name, email and phone as part of custom order request

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
    <>
      <Text fw="bold">Quote for this custom order should be addressed to:</Text>

      <Flex gap={8} direction={{ base: "column", sm: "row" }}>
        <TextInput
          label="Customer name"
          placeholder="name"
          className="flex-1"
          value={context.contactName}
          onChange={(e) => context.setContactName(e.currentTarget.value)}
        />
        <TextInput
          label="Phone(optional)"
          placeholder="phone number"
          className="flex-1"
          value={context.phone}
          onChange={(e) => context.setPhone(e.currentTarget.value)}
        />
        <TextInput
          label="Email(optional)"
          placeholder="email address"
          className="flex-1"
          value={context.email}
          onChange={(e) => context.setEmail(e.currentTarget.value)}
        />
      </Flex>

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
            Send request
          </Button>
        </Group>
      </Card>
    </>
  );
};
