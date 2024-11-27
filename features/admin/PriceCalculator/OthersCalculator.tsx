import { useState } from "react";
import {
  TextInput,
  NumberInput,
  Stack,
  Paper,
  Group,
  Text,
  Textarea,
  Select,
} from "@mantine/core";
import { PREDEFINED_OTHER_ITEMS, CURRENCY_SYMBOL } from "./constants";
import { CalculationHistoryPanel } from "./components/CalculationHistoryPanel";
import { useCalculationHistory } from "./hooks/useCalculationHistory";
import { CalculationHistory } from "./types";

export function OthersCalculator() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const { history, showHistory, setShowHistory, clearHistory, saveToHistory } =
    useCalculationHistory("others");

  const handlePredefinedItemSelect = (value: string | null) => {
    setSelectedItem(value);
    if (value) {
      const item = PREDEFINED_OTHER_ITEMS.find((item) => item.id === value);
      if (item) {
        setItemName(item.name);
        setPrice(item.price);
      }
    } else {
      setItemName("");
      setPrice(0);
    }
  };

  const calculatePrice = () => {
    return (price * quantity).toFixed(2);
  };

  const handleSaveHistory = () => {
    if (!itemName || price <= 0) return;

    saveToHistory({
      category: "others",
      details: {
        printType: itemName,
        quantity,
        rate: price,
        total: Number(calculatePrice()),
      },
    });
  };

  const handleLoadHistory = (item: CalculationHistory) => {
    if (item.details.printType) {
      setItemName(item.details.printType);
      // Try to find matching predefined item
      const predefinedItem = PREDEFINED_OTHER_ITEMS.find(
        (pi) => pi.name === item.details.printType
      );
      setSelectedItem(predefinedItem?.id || null);
    }
    if (item.details.rate) {
      setPrice(item.details.rate);
    }
    setQuantity(item.details.quantity);
  };

  return (
    <Stack gap="md" mt="md">
      <Select
        label="Predefined Items"
        placeholder="Select a predefined item"
        value={selectedItem}
        onChange={handlePredefinedItemSelect}
        data={[
          {
            group: "Pressing",
            items: PREDEFINED_OTHER_ITEMS.filter(
              (item) => item.category === "pressing"
            ).map((item) => ({
              value: item.id,
              label: `${item.name}`,
            })),
          },
          {
            group: "Jersey",
            items: PREDEFINED_OTHER_ITEMS.filter(
              (item) => item.category === "jersey"
            ).map((item) => ({
              value: item.id,
              label: `${item.name}`,
            })),
          },
          {
            group: "Envelopes",
            items: PREDEFINED_OTHER_ITEMS.filter(
              (item) => item.category === "envelope"
            ).map((item) => ({
              value: item.id,
              label: `${item.name}`,
            })),
          },
          {
            group: "Lamination",
            items: PREDEFINED_OTHER_ITEMS.filter(
              (item) => item.category === "lamination"
            ).map((item) => ({
              value: item.id,
              label: `${item.name}`,
            })),
          },
          {
            group: "Photo",
            items: PREDEFINED_OTHER_ITEMS.filter(
              (item) => item.category === "photo"
            ).map((item) => ({
              value: item.id,
              label: `${item.name}`,
            })),
          },
          {
            group: "Papers",
            items: PREDEFINED_OTHER_ITEMS.filter(
              (item) => item.category === "paper"
            ).map((item) => ({
              value: item.id,
              label: `${item.name}`,
            })),
          },
          {
            group: "Design",
            items: PREDEFINED_OTHER_ITEMS.filter(
              (item) => item.category === "design"
            ).map((item) => ({
              value: item.id,
              label: `${item.name} `,
            })),
          },
        ]}
        searchable
        clearable
      />

      <TextInput
        label="Item Name"
        placeholder="Enter item description"
        value={itemName}
        onChange={(event) => setItemName(event.currentTarget.value)}
      />

      <NumberInput
        label="Unit Price"
        value={price}
        onChange={(val) => setPrice(Number(val) || 0)}
        min={0}
        decimalScale={2}
        prefix={CURRENCY_SYMBOL}
      />

      <NumberInput
        label="Quantity"
        value={quantity}
        onChange={(val) => setQuantity(Number(val) || 1)}
        min={1}
      />

      <Textarea
        label="Notes"
        placeholder="Add any additional notes or specifications"
        value={notes}
        onChange={(event) => setNotes(event.currentTarget.value)}
        minRows={3}
      />

      <CalculationHistoryPanel
        history={history}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onClearHistory={clearHistory}
        onLoadHistory={handleLoadHistory}
        onSave={handleSaveHistory}
        canSave={!!itemName && price > 0}
      />

      <Paper p="md" withBorder>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text>Item:</Text>
            <Text>{itemName || "Not specified"}</Text>
          </Group>
          <Group justify="space-between">
            <Text>Unit Price:</Text>
            <Text>
              {CURRENCY_SYMBOL}
              {price.toFixed(2)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text>Quantity:</Text>
            <Text>{quantity}</Text>
          </Group>
          {notes && (
            <Group align="flex-start">
              <Text>Notes:</Text>
              <Text style={{ flex: 1 }}>{notes}</Text>
            </Group>
          )}
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
