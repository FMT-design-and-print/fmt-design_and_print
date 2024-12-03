import {
  Group,
  SegmentedControl,
  Stack,
  Select,
  Button,
  Menu,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { IconCalendar } from "@tabler/icons-react";
import { OrderStatus, DeliveryType } from "@/types/order";
import { DATE_PRESETS } from "@/constants/presets";

interface FiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  dateRange: [Date | null, Date | null];
  type: "all" | "orders" | "customOrders" | "manualSales";
  status?: OrderStatus;
  deliveryType?: DeliveryType;
}

const ACTIVE_STATUSES = [
  "placed",
  "processing",
  "shipped",
  "delivered",
  "packaging",
  "ready",
  "completed",
] as const;

const DELIVERY_TYPES = ["pickup", "delivery"] as const;

export default function Filters({ onFilterChange }: FiltersProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [type, setType] = useState<FilterValues["type"]>("all");
  const [status, setStatus] = useState<OrderStatus>();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>();
  const [activePreset, setActivePreset] = useState<string>("thisWeek");

  useEffect(() => {
    onFilterChange({ dateRange, type, status, deliveryType });
  }, [dateRange, type, status, deliveryType, onFilterChange]);

  useEffect(() => {
    const [start, end] = DATE_PRESETS.thisWeek.getValue();
    setDateRange([start, end]);
  }, []);

  const handleDatePreset = (preset: keyof typeof DATE_PRESETS) => {
    const [start, end] = DATE_PRESETS[preset].getValue();
    setDateRange([start, end]);
    setActivePreset(preset);
  };

  const getDateRangeLabel = () => {
    if (activePreset) {
      return `Viewing Results for ${DATE_PRESETS[activePreset as keyof typeof DATE_PRESETS].label}`;
    }
    if (dateRange[0] && dateRange[1]) {
      return `Viewing Results for ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`;
    }
    return "Viewing All Time Results";
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end" wrap="nowrap">
        <Group gap="sm" align="flex-end">
          <Menu>
            <Menu.Target>
              <Button
                color="pink"
                variant="light"
                size="xs"
                leftSection={<IconCalendar size={16} />}
              >
                {activePreset
                  ? DATE_PRESETS[activePreset as keyof typeof DATE_PRESETS]
                      .label
                  : "Presets"}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {Object.entries(DATE_PRESETS).map(([key, { label }]) => (
                <Menu.Item
                  key={key}
                  onClick={() =>
                    handleDatePreset(key as keyof typeof DATE_PRESETS)
                  }
                >
                  {label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <DatePickerInput
            type="range"
            label="Date Range"
            placeholder="Pick dates range"
            value={dateRange}
            onChange={(value) => {
              setDateRange(value);
              setActivePreset("");
            }}
            w={{ base: "100%", sm: "auto" }}
            clearable
            size="xs"
            color="pink"
          />
          <Text size="sm" c="dimmed">
            {getDateRangeLabel()}
          </Text>
        </Group>
      </Group>
      <SegmentedControl
        size="xs"
        data={[
          { label: "All", value: "all" },
          { label: "Orders", value: "orders" },
          { label: "Custom Orders", value: "customOrders" },
          { label: "Manual Sales", value: "manualSales" },
        ]}
        value={type}
        onChange={(value) => setType(value as FilterValues["type"])}
        color="pink"
      />

      <Group gap="sm">
        {type === "orders" && (
          <>
            <Select
              label="Status"
              placeholder="All statuses"
              data={[
                { label: "All", value: "" },
                ...ACTIVE_STATUSES.map((status) => ({
                  label: status,
                  value: status,
                })),
              ]}
              value={status}
              onChange={(value) => setStatus(value as OrderStatus)}
              clearable
            />
            <Select
              label="Delivery Type"
              placeholder="All types"
              data={[
                { label: "All", value: "" },
                ...DELIVERY_TYPES.map((type) => ({
                  label: type,
                  value: type,
                })),
              ]}
              value={deliveryType}
              onChange={(value) => setDeliveryType(value as DeliveryType)}
              clearable
            />
          </>
        )}
      </Group>
    </Stack>
  );
}
