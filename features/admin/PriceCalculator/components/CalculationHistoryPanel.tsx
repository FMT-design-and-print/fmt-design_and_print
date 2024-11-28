import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconHistory, IconTrash } from "@tabler/icons-react";
import { CalculationHistory } from "../types";
import { CURRENCY_SYMBOL } from "../constants";

type CalculationHistoryPanelProps = {
  history: CalculationHistory[];
  showHistory: boolean;
  onToggleHistory: () => void;
  onClearHistory: () => void;
  onLoadHistory: (item: CalculationHistory) => void;
  onSave: () => void;
  canSave: boolean;
};

export function CalculationHistoryPanel({
  history,
  showHistory,
  onToggleHistory,
  onClearHistory,
  onLoadHistory,
  onSave,
  canSave,
}: CalculationHistoryPanelProps) {
  return (
    <>
      <Group justify="space-between" mt="md">
        <Button
          leftSection={<IconHistory size={20} />}
          variant="light"
          onClick={onToggleHistory}
          size="xs"
        >
          {showHistory ? "Hide History" : "Show History"}
        </Button>
        <Button onClick={onSave} disabled={!canSave} size="xs">
          Save Calculation
        </Button>
      </Group>

      {showHistory && history.length > 0 && (
        <Paper withBorder p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Recent Calculations</Text>
            <Tooltip label="Clear History">
              <ActionIcon
                color="red"
                variant="light"
                onClick={onClearHistory}
                size="sm"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Stack gap="xs">
            {history.map((item) => (
              <Paper
                key={item.id}
                withBorder
                p="xs"
                style={{ cursor: "pointer" }}
                onClick={() => onLoadHistory(item)}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      {item.details.printType}
                    </Text>
                    {item.details.size && (
                      <Text size="xs" c="dimmed">
                        {new Date(item.timestamp).toLocaleString()} -{" "}
                        {item.details.size.width} x {item.details.size.height}{" "}
                        {item.details.size.unit} (Qty: {item.details.quantity})
                      </Text>
                    )}
                    {!item.details.size && (
                      <Text size="xs" c="dimmed">
                        {new Date(item.timestamp).toLocaleString()} - Qty:{" "}
                        {item.details.quantity}
                      </Text>
                    )}
                  </Stack>
                  <Text fw={500}>
                    {CURRENCY_SYMBOL}
                    {item.details.total.toFixed(2)}
                  </Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Paper>
      )}
    </>
  );
}
