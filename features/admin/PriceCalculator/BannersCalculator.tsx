import {
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { CalculationHistoryPanel } from "./components/CalculationHistoryPanel";
import { CURRENCY_SYMBOL, PREDEFINED_SIZES, PRINT_TYPES } from "./constants";
import { CalculationHistory, ItemSize } from "./types";
import {
  convertMeasurement,
  getCalculationHistory,
  roundToTwoDecimals,
  saveCalculationHistory,
} from "./utils";

export function BannersCalculator() {
  const [size, setSize] = useState<ItemSize>({
    width: 0,
    height: 0,
    unit: "mm",
  });
  const [quantity, setQuantity] = useState(1);
  const [predefinedSize, setPredefinedSize] = useState<string | null>(null);
  const [selectedPrintType, setSelectedPrintType] = useState<string | null>(
    null
  );
  const [customRate, setCustomRate] = useState<number | undefined>();
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CalculationHistory[]>(
    getCalculationHistory("banners-stickers")
  );

  const currentRate =
    customRate ??
    PRINT_TYPES.find((type) => type.id === selectedPrintType)?.rate ??
    0;

  const handleUnitChange = (newUnit: ItemSize["unit"]) => {
    if (newUnit) {
      const newWidth = roundToTwoDecimals(
        convertMeasurement(size.width, size.unit, newUnit)
      );
      const newHeight = roundToTwoDecimals(
        convertMeasurement(size.height, size.unit, newUnit)
      );
      setSize({
        width: newWidth,
        height: newHeight,
        unit: newUnit,
      });
    }
  };

  const handlePredefinedSizeChange = (value: string | null) => {
    if (value) {
      const selected = PREDEFINED_SIZES.find((size) => size.name === value);
      if (selected) {
        const width =
          size.unit === "mm"
            ? selected.width
            : roundToTwoDecimals(
                convertMeasurement(selected.width, "mm", size.unit)
              );
        const height =
          size.unit === "mm"
            ? selected.height
            : roundToTwoDecimals(
                convertMeasurement(selected.height, "mm", size.unit)
              );
        setSize({
          ...size,
          width,
          height,
        });
      }
    }
    setPredefinedSize(value);
  };

  const handlePrintTypeChange = (value: string | null) => {
    setSelectedPrintType(value);
    setCustomRate(undefined); // Reset custom rate when print type changes
  };

  const calculatePrice = () => {
    if (!selectedPrintType) return "0.00";

    // Convert measurements to feet for calculation
    const widthInFeet = convertMeasurement(size.width, size.unit, "ft");
    const heightInFeet = convertMeasurement(size.height, size.unit, "ft");
    return (widthInFeet * heightInFeet * currentRate * quantity).toFixed(2);
  };

  const saveToHistory = () => {
    if (!selectedPrintType) return;

    const calculation: CalculationHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: "banners-stickers",
      details: {
        printType: PRINT_TYPES.find((type) => type.id === selectedPrintType)
          ?.name,
        size: {
          width: size.width,
          height: size.height,
          unit: size.unit,
        },
        quantity,
        rate: currentRate,
        total: Number(calculatePrice()),
      },
    };

    saveCalculationHistory(calculation);
    setHistory(getCalculationHistory("banners-stickers"));
  };

  const clearHistory = () => {
    localStorage.setItem(
      "calculationHistory",
      JSON.stringify({ "banners-stickers": [] })
    );
    setHistory([]);
  };

  const loadFromHistory = (item: CalculationHistory) => {
    if (item.details.size) {
      setSize({
        width: item.details.size.width,
        height: item.details.size.height,
        unit: item.details.size.unit as ItemSize["unit"],
      });
    }

    if (item.details.printType) {
      const printType = PRINT_TYPES.find(
        (type) => type.name === item.details.printType
      );
      setSelectedPrintType(printType?.id || null);
    }

    setQuantity(item.details.quantity);
    if (item.details.rate) {
      setCustomRate(item.details.rate);
    }
  };

  return (
    <Stack gap="md" mt="md">
      <Grid align="flex-end">
        <Grid.Col span={8}>
          <Select
            label="Print Type"
            placeholder="Select print type"
            value={selectedPrintType}
            onChange={handlePrintTypeChange}
            data={[
              {
                group: "Banners",
                items: PRINT_TYPES.filter(
                  (type) => type.category === "banner"
                ).map((type) => ({
                  value: type.id,
                  label: `${type.name}`,
                })),
              },
              {
                group: "Stickers",
                items: PRINT_TYPES.filter(
                  (type) => type.category === "sticker"
                ).map((type) => ({
                  value: type.id,
                  label: `${type.name}`,
                })),
              },
            ]}
            searchable
            clearable
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label="Square Foot Rate"
            value={currentRate}
            onChange={(val) => setCustomRate(Number(val) || 0)}
            min={0}
            decimalScale={3}
            step={0.5}
          />
        </Grid.Col>
      </Grid>

      <Select
        label="Predefined Size"
        placeholder="Select a standard size"
        value={predefinedSize}
        onChange={handlePredefinedSizeChange}
        data={PREDEFINED_SIZES.map((size) => size.name)}
        clearable
      />

      <Select
        label="Unit"
        value={size.unit}
        onChange={(val) => handleUnitChange(val as ItemSize["unit"])}
        data={[
          { value: "mm", label: "Millimeters" },
          { value: "cm", label: "Centimeters" },
          { value: "inch", label: "Inches" },
          { value: "ft", label: "Feet" },
        ]}
      />

      <Grid>
        <Grid.Col span={6}>
          <NumberInput
            label="Width"
            value={size.width}
            onChange={(val) => setSize({ ...size, width: Number(val) || 0 })}
            min={0}
            decimalScale={3}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Height"
            value={size.height}
            onChange={(val) => setSize({ ...size, height: Number(val) || 0 })}
            min={0}
            decimalScale={3}
          />
        </Grid.Col>
      </Grid>

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
        onLoadHistory={loadFromHistory}
        onSave={saveToHistory}
        canSave={!!selectedPrintType}
      />

      <Paper p="md" withBorder>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text>Print Type:</Text>
            <Text>
              {PRINT_TYPES.find((type) => type.id === selectedPrintType)
                ?.name || "Not selected"}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text>Rate per sq ft:</Text>
            <Text>
              {CURRENCY_SYMBOL}
              {currentRate.toFixed(2)}
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
