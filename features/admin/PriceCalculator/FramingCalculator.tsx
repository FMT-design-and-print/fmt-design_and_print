import { useState } from "react";
import {
  Select,
  NumberInput,
  Stack,
  Grid,
  Paper,
  Group,
  Text,
} from "@mantine/core";
import { CURRENCY_SYMBOL } from "./constants";
import { CalculationHistory, ItemSize } from "./types";
import { CalculationHistoryPanel } from "./components/CalculationHistoryPanel";
import { useCalculationHistory } from "./hooks/useCalculationHistory";
import {
  convertMeasurement,
  getFramingSettings,
  roundToTwoDecimals,
} from "./utils";

export function FramingCalculator() {
  const settings = getFramingSettings();
  const [frameType, setFrameType] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [displayUnit, setDisplayUnit] = useState<ItemSize["unit"]>("mm");

  const { history, showHistory, setShowHistory, clearHistory, saveToHistory } =
    useCalculationHistory("framing");

  const selectedFrame = frameType
    ? settings?.frameTypes.find((f) => f.id === frameType)
    : null;

  const selectedFrameSize =
    selectedSize && selectedFrame
      ? selectedFrame.sizes.find((s) => s.id === selectedSize)
      : null;

  const convertedDimensions = selectedFrameSize
    ? {
        width: roundToTwoDecimals(
          convertMeasurement(
            selectedFrameSize.width,
            selectedFrameSize.unit,
            displayUnit
          )
        ),
        height: roundToTwoDecimals(
          convertMeasurement(
            selectedFrameSize.height,
            selectedFrameSize.unit,
            displayUnit
          )
        ),
      }
    : { width: 0, height: 0 };

  const calculatePrice = () => {
    if (!selectedFrameSize) return "0.00";
    return (selectedFrameSize.price * quantity).toFixed(2);
  };

  const handleSaveHistory = () => {
    if (!selectedFrame || !selectedFrameSize) return;

    saveToHistory({
      category: "framing",
      details: {
        printType: `${selectedFrame.name} - ${selectedFrameSize.name}`,
        size: {
          width: selectedFrameSize.width,
          height: selectedFrameSize.height,
          unit: selectedFrameSize.unit,
        },
        quantity,
        total: Number(calculatePrice()),
      },
    });
  };

  const handleLoadHistory = (item: CalculationHistory) => {
    if (item.details.printType && settings) {
      const [frameName, sizeName] = item.details.printType.split(" - ");
      const frame = settings.frameTypes.find((f) => f.name === frameName);
      if (frame) {
        setFrameType(frame.id);
        const size = frame.sizes.find((s) => s.name === sizeName);
        if (size) {
          setSelectedSize(size.id);
        }
      }
    }
    setQuantity(item.details.quantity);
  };

  if (!settings) return null;

  return (
    <Stack gap="md" mt="md">
      <Select
        label="Frame Type"
        placeholder="Select frame type"
        value={frameType}
        onChange={(val) => {
          setFrameType(val);
          setSelectedSize(null);
        }}
        data={settings.frameTypes.map((frame) => ({
          value: frame.id,
          label: frame.name,
        }))}
      />

      <Select
        label="Size"
        placeholder="Select size"
        value={selectedSize}
        onChange={setSelectedSize}
        disabled={!frameType}
        data={
          selectedFrame?.sizes.map((size) => ({
            value: size.id,
            label: `${size.name} (${size.width} x ${size.height} ${size.unit})`,
          })) || []
        }
      />

      <Grid>
        <Grid.Col span={6}>
          <NumberInput
            label="Width"
            value={convertedDimensions.width}
            readOnly
            disabled
            description={displayUnit}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Height"
            value={convertedDimensions.height}
            readOnly
            disabled
            description={displayUnit}
          />
        </Grid.Col>
      </Grid>

      <Select
        label="Display Unit"
        value={displayUnit}
        onChange={(val) => setDisplayUnit(val as ItemSize["unit"])}
        data={[
          { value: "mm", label: "Millimeters" },
          { value: "cm", label: "Centimeters" },
          { value: "inch", label: "Inches" },
          { value: "ft", label: "Feet" },
        ]}
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
        canSave={!!selectedSize}
      />

      <Paper p="md" withBorder>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text>Frame Type:</Text>
            <Text>{selectedFrame?.name || "Not selected"}</Text>
          </Group>
          {selectedFrameSize && (
            <>
              <Group justify="space-between">
                <Text>Size:</Text>
                <Text>
                  {selectedFrameSize.name} ({convertedDimensions.width} x{" "}
                  {convertedDimensions.height} {displayUnit})
                </Text>
              </Group>
              <Group justify="space-between">
                <Text>Unit Price:</Text>
                <Text>
                  {CURRENCY_SYMBOL}
                  {selectedFrameSize.price.toFixed(2)}
                </Text>
              </Group>
            </>
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
