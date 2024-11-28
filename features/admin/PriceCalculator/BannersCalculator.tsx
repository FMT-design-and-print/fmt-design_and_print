import { useState } from "react";
import {
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { CURRENCY_SYMBOL, PREDEFINED_SIZES } from "./constants";
import { CalculationHistory, ItemSize } from "./types";
import { CalculationHistoryPanel } from "./components/CalculationHistoryPanel";
import {
  convertMeasurement,
  getBannersStickersSettings,
  roundToTwoDecimals,
} from "./utils";
import { useCalculationHistory } from "./hooks/useCalculationHistory";

export function BannersCalculator() {
  const settings = getBannersStickersSettings();
  const [size, setSize] = useState<ItemSize>({
    width: 0,
    height: 0,
    unit: "mm",
  });
  const [quantity, setQuantity] = useState(1);
  const [selectedPrintType, setSelectedPrintType] = useState<string | null>(
    null
  );
  const [customRate, setCustomRate] = useState<number | undefined>();
  const [predefinedSize, setPredefinedSize] = useState<string | null>(null);

  const { history, showHistory, setShowHistory, clearHistory, saveToHistory } =
    useCalculationHistory("banners-stickers");

  const selectedPrintTypeData = settings?.printTypes.find(
    (type) => type.id === selectedPrintType
  );

  const currentRate = customRate ?? selectedPrintTypeData?.rate ?? 0;

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

  const calculatePrice = () => {
    if (!selectedPrintType) return "0.00";

    // Convert measurements to feet for calculation
    const widthInFeet = convertMeasurement(size.width, size.unit, "ft");
    const heightInFeet = convertMeasurement(size.height, size.unit, "ft");
    return (widthInFeet * heightInFeet * currentRate * quantity).toFixed(2);
  };

  const handleSaveHistory = () => {
    if (!selectedPrintType || !selectedPrintTypeData) return;

    saveToHistory({
      category: "banners-stickers",
      details: {
        printType: selectedPrintTypeData.name,
        size: {
          width: size.width,
          height: size.height,
          unit: size.unit,
        },
        quantity,
        rate: currentRate,
        total: Number(calculatePrice()),
      },
    });
  };

  const handleLoadHistory = (item: CalculationHistory) => {
    if (item.details.printType && settings) {
      const printType = settings.printTypes.find(
        (type) => type.name === item.details.printType
      );
      setSelectedPrintType(printType?.id || null);
    }
    if (item.details.size) {
      setSize({
        width: item.details.size.width,
        height: item.details.size.height,
        unit: item.details.size.unit as ItemSize["unit"],
      });
    }
    setQuantity(item.details.quantity);
    if (item.details.rate) {
      setCustomRate(item.details.rate);
    }
  };

  const handlePredefinedSizeChange = (value: string | null) => {
    setPredefinedSize(value);
    if (value) {
      const selected = PREDEFINED_SIZES.find((s) => s.name === value);
      if (selected) {
        setSize({
          width: selected.width,
          height: selected.height,
          unit: "mm", // Predefined sizes are in mm
        });
      }
    }
  };

  if (!settings) return null;

  const bannerTypes = settings.printTypes.filter(
    (type) => type.category === "banner"
  );
  const stickerTypes = settings.printTypes.filter(
    (type) => type.category === "sticker"
  );

  return (
    <Stack gap="md" mt="md">
      <Grid align="flex-end">
        <Grid.Col span={8}>
          <Select
            label="Print Type"
            placeholder="Select print type"
            value={selectedPrintType}
            onChange={(val) => {
              setSelectedPrintType(val);
              setCustomRate(undefined);
            }}
            data={[
              {
                group: "Banners",
                items: bannerTypes.map((type) => ({
                  value: type.id,
                  label: type.name,
                })),
              },
              {
                group: "Stickers",
                items: stickerTypes.map((type) => ({
                  value: type.id,
                  label: type.name,
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
            decimalScale={2}
            step={0.5}
            readOnly
          />
        </Grid.Col>
      </Grid>

      <Select
        label="Predefined Size"
        placeholder="Select a standard size"
        value={predefinedSize}
        onChange={handlePredefinedSizeChange}
        data={PREDEFINED_SIZES.map((size) => ({
          value: size.name,
          label: `${size.name} (${size.width} x ${size.height} mm)`,
        }))}
        clearable
      />

      <Grid>
        <Grid.Col span={6}>
          <NumberInput
            label="Width"
            value={size.width}
            onChange={(val) => {
              setSize({ ...size, width: Number(val) || 0 });
              setPredefinedSize(null); // Clear predefined size when width changes
            }}
            min={0}
            decimalScale={3}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Height"
            value={size.height}
            onChange={(val) => {
              setSize({ ...size, height: Number(val) || 0 });
              setPredefinedSize(null); // Clear predefined size when height changes
            }}
            min={0}
            decimalScale={3}
          />
        </Grid.Col>
      </Grid>

      <Select
        label="Unit"
        value={size.unit}
        onChange={(val) => handleUnitChange(val as ItemSize["unit"])}
        data={settings.units.map((unit) => ({
          value: unit,
          label:
            unit === "mm"
              ? "Millimeters"
              : unit === "cm"
                ? "Centimeters"
                : unit === "inch"
                  ? "Inches"
                  : "Feet",
        }))}
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
        canSave={!!selectedPrintType}
      />

      <Paper p="md" withBorder>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text>Print Type:</Text>
            <Text>{selectedPrintTypeData?.name || "Not selected"}</Text>
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
