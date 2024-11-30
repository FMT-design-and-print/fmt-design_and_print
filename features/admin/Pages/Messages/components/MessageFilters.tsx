import { Button, Group, Menu, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconChevronDown } from "@tabler/icons-react";
import {
  addDays,
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { useMemo, useState, useEffect } from "react";

interface MessageFiltersProps {
  onDateRangeChange: (
    range: [Date | null, Date | null],
    preset: string | null
  ) => void;
  dateRange: [Date | null, Date | null];
  selectedPreset: string | null;
}

type DatePreset =
  | "today"
  | "yesterday"
  | "3days"
  | "7days"
  | "thisMonth"
  | "custom";

export function MessageFilters({
  onDateRangeChange,
  dateRange,
  selectedPreset: externalSelectedPreset,
}: MessageFiltersProps) {
  const [selectedPreset, setSelectedPreset] = useState<DatePreset | null>(
    externalSelectedPreset as DatePreset | null
  );

  useEffect(() => {
    setSelectedPreset(externalSelectedPreset as DatePreset | null);
  }, [externalSelectedPreset]);

  const presets = useMemo(() => {
    const today = new Date();
    return {
      today: [startOfDay(today), endOfDay(today)],
      yesterday: [startOfDay(addDays(today, -1)), endOfDay(addDays(today, -1))],
      "3days": [startOfDay(addDays(today, -3)), endOfDay(today)],
      "7days": [startOfDay(addDays(today, -7)), endOfDay(today)],
      thisMonth: [startOfMonth(today), endOfMonth(today)],
    } as const;
  }, []);

  const handlePresetSelect = (preset: DatePreset) => {
    setSelectedPreset(preset);
    if (preset === "custom") {
      return;
    }
    const range = presets[preset as keyof typeof presets];
    onDateRangeChange([range[0], range[1]], preset);
  };

  const handleCustomDateChange = (value: [Date | null, Date | null]) => {
    if (value[0] && value[1]) {
      onDateRangeChange([startOfDay(value[0]), endOfDay(value[1])], "custom");
    }
  };

  const clearFilters = () => {
    setSelectedPreset(null);
    onDateRangeChange([null, null], null);
  };

  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button
              variant="light"
              color="pink"
              leftSection={<IconCalendar size="1rem" />}
              rightSection={<IconChevronDown size="1rem" />}
            >
              {selectedPreset
                ? selectedPreset.charAt(0).toUpperCase() +
                  selectedPreset.slice(1)
                : "Filter by date"}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Date Presets</Menu.Label>
            <Menu.Item onClick={() => handlePresetSelect("today")}>
              Today
            </Menu.Item>
            <Menu.Item onClick={() => handlePresetSelect("yesterday")}>
              Yesterday
            </Menu.Item>
            <Menu.Item onClick={() => handlePresetSelect("3days")}>
              Last 3 Days
            </Menu.Item>
            <Menu.Item onClick={() => handlePresetSelect("7days")}>
              Last 7 Days
            </Menu.Item>
            <Menu.Item onClick={() => handlePresetSelect("thisMonth")}>
              This Month
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={() => handlePresetSelect("custom")}>
              Custom Range
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {(selectedPreset || dateRange[0] || dateRange[1]) && (
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        )}
      </Group>

      {selectedPreset === "custom" && (
        <DatePickerInput
          type="range"
          label="Custom Date Range"
          placeholder="Pick dates range"
          value={dateRange}
          onChange={handleCustomDateChange}
          clearable
        />
      )}
    </Stack>
  );
}
