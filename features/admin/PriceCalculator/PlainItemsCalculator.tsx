import { useState } from "react";
import { Select, NumberInput, Stack, Paper, Group, Text } from "@mantine/core";
import { CURRENCY_SYMBOL } from "./constants";
import { CalculationHistoryPanel } from "./components/CalculationHistoryPanel";
import { useCalculationHistory } from "./hooks/useCalculationHistory";
import { CalculationHistory } from "./types";
import { getPlainItemsSettings } from "./utils";

export function PlainItemsCalculator() {
  const settings = getPlainItemsSettings();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { history, showHistory, setShowHistory, clearHistory, saveToHistory } =
    useCalculationHistory("plain-items");

  const selectedItemData = selectedItem
    ? settings?.items.find((item) => item.id === selectedItem)
    : null;

  const calculatePrice = () => {
    if (!selectedItemData) return "0.00";
    return (selectedItemData.price * quantity).toFixed(2);
  };

  const handleSaveHistory = () => {
    if (!selectedItemData) return;

    saveToHistory({
      category: "plain-items",
      details: {
        printType: selectedItemData.name,
        quantity,
        total: Number(calculatePrice()),
      },
    });
  };

  const handleLoadHistory = (item: CalculationHistory) => {
    if (item.details.printType && settings) {
      const plainItem = settings.items.find(
        (pi) => pi.name === item.details.printType
      );
      setSelectedItem(plainItem?.id || null);
      setQuantity(item.details.quantity);
    }
  };

  if (!settings) return null;

  return (
    <Stack gap="md" mt="md">
      <Select
        label="Select Item"
        placeholder="Choose a plain item"
        value={selectedItem}
        onChange={setSelectedItem}
        data={settings.items.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        searchable
      />

      <NumberInput
        label="Quantity"
        value={quantity}
        onChange={(val) => setQuantity(Number(val) || 1)}
        min={1}
      />

      <CalculationHistoryPanel
        history={history}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onClearHistory={clearHistory}
        onLoadHistory={handleLoadHistory}
        onSave={handleSaveHistory}
        canSave={!!selectedItem}
      />

      <Paper p="md" withBorder>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text>Selected Item:</Text>
            <Text>{selectedItemData?.name || "Not selected"}</Text>
          </Group>
          <Group justify="space-between">
            <Text>Unit Price:</Text>
            <Text>
              {CURRENCY_SYMBOL}
              {selectedItemData?.price.toFixed(2) || "0.00"}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text fw={700}>Total Price:</Text>
            <Text fw={700} size="lg">
              {CURRENCY_SYMBOL}
              {calculatePrice()}
            </Text>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
