import { useState, useEffect } from "react";
import { Select, NumberInput, Stack, Paper, Group, Text } from "@mantine/core";
import { CUSTOMIZED_ITEMS, CURRENCY_SYMBOL } from "./constants";
import { CalculationHistoryPanel } from "./components/CalculationHistoryPanel";
import { useCalculationHistory } from "./hooks/useCalculationHistory";
import { CalculationHistory } from "./types";

export function CustomizedItemsCalculator() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { history, showHistory, setShowHistory, clearHistory, saveToHistory } =
    useCalculationHistory("customized-items");

  useEffect(() => {
    if (selectedItem) {
      const item = CUSTOMIZED_ITEMS.find((item) => item.id === selectedItem);
      if (item?.minQuantity) {
        setQuantity(item.minQuantity);
      } else {
        setQuantity(1);
      }
    }
  }, [selectedItem]);

  const calculatePrice = () => {
    const item = CUSTOMIZED_ITEMS.find((item) => item.id === selectedItem);
    return item ? (item.price * quantity).toFixed(2) : "0.00";
  };

  const handleSaveHistory = () => {
    if (!selectedItem) return;

    const item = CUSTOMIZED_ITEMS.find((item) => item.id === selectedItem);
    if (!item) return;

    saveToHistory({
      category: "customized-items",
      details: {
        printType: item.name,
        quantity,
        total: Number(calculatePrice()),
      },
    });
  };

  const handleLoadHistory = (item: CalculationHistory) => {
    if (item.details.printType) {
      const customItem = CUSTOMIZED_ITEMS.find(
        (ci) => ci.name === item.details.printType
      );
      setSelectedItem(customItem?.id || null);
    }
  };

  const selectedItemData = selectedItem
    ? CUSTOMIZED_ITEMS.find((item) => item.id === selectedItem)
    : null;

  return (
    <Stack gap="md" mt="md">
      <Select
        label="Select Item"
        placeholder="Choose an item"
        value={selectedItem}
        onChange={setSelectedItem}
        data={CUSTOMIZED_ITEMS.map((item) => ({
          value: item.id,
          label: `${item.name}`,
        }))}
      />

      <NumberInput
        label="Quantity"
        value={quantity}
        onChange={(val) => {
          const newValue = Number(val) || 1;
          const minQty = selectedItemData?.minQuantity || 1;
          setQuantity(Math.max(newValue, minQty));
        }}
        min={selectedItemData?.minQuantity || 1}
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
          {selectedItemData?.minQuantity && (
            <Group justify="space-between">
              <Text>Minimum Quantity:</Text>
              <Text>{selectedItemData.minQuantity}</Text>
            </Group>
          )}
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
