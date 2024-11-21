import { QuoteReceptionMedium } from "@/types";
import { Card, Group, Input, Radio, Stack, Text } from "@mantine/core";

interface Props {
  label?: string;
  medium: QuoteReceptionMedium;
  setMedium?: (value: QuoteReceptionMedium) => void;
  value: string;
  setValue?: (value: string) => void;
}

export const QuoteReceptionOptions = ({
  label,
  medium,
  value,
  setMedium,
  setValue,
}: Props) => {
  const inputLabel =
    medium === "email"
      ? "Email address"
      : medium === "whatsapp"
        ? "Active Whatsapp number"
        : "Phone number to receive SMS";

  return (
    <Card withBorder>
      <Text size="sm" c="dimmed" mb="lg">
        {label || "How do you want to receive your quote?"}
      </Text>
      <Group justify="space-between">
        <Stack gap={16}>
          <Radio.Group
            defaultValue="email"
            value={medium}
            onChange={(value) => {
              setMedium?.(value as QuoteReceptionMedium);
              setValue?.("");
            }}
          >
            <Group>
              <Radio value="email" label="Email" color="pink" />
              <Radio value="whatsapp" label="Whatsapp" color="pink" />
              <Radio value="sms" label="SMS" color="pink" />
            </Group>
          </Radio.Group>

          <Input
            value={value}
            onChange={(e) => {
              setValue?.(e.currentTarget.value);
            }}
            placeholder={inputLabel}
          />
        </Stack>
      </Group>
    </Card>
  );
};
