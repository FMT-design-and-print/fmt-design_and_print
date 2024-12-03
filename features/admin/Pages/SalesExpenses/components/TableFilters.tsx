import {
  Group,
  MultiSelect,
  Stack,
  TextInput,
  SegmentedControl,
  Button,
  Select,
  Title,
} from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import { useMemo, useState } from "react";
import { ISales, Expenses } from "@/types/sales-expenses";
import { Filters, AmountFilter } from "../hooks/useFilters";
import { DATE_PRESETS } from "@/constants/presets";

interface TableFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  data: (ISales | Expenses)[];
}

function areDatesEqual(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function TableFilters({
  filters,
  onFiltersChange,
  data,
}: TableFiltersProps) {
  const [amountType, setAmountType] = useState<AmountFilter["type"]>("exact");
  const [amountValue, setAmountValue] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const presets = {
    today: DATE_PRESETS.today,
    thisWeek: DATE_PRESETS.thisWeek,
    thisMonth: DATE_PRESETS.thisMonth,
    last30Days: DATE_PRESETS.last30Days,
  };

  const uniqueUsers = useMemo(() => {
    if (!data?.length) return [];

    const uniqueItems = Array.from(
      new Map(
        data.map((item) => [
          item.createdBy.userId,
          {
            value: item.createdBy.userId,
            label: item.createdBy.name,
          },
        ])
      ).values()
    );

    return uniqueItems;
  }, [data]);

  const handleAmountChange = (value: string) => {
    setAmountValue(value);
    const numValue = Number(value);
    onFiltersChange({
      ...filters,
      amount: value
        ? { type: amountType, value: numValue }
        : { type: amountType, value: null },
    });
  };

  const handleDateChange = (value: DatesRangeValue) => {
    onFiltersChange({
      ...filters,
      dateRange: value,
    });
  };

  const handleFilterChange = (newFilters: string[]) => {
    setActiveFilters(newFilters);

    if (!newFilters.includes("amount") && filters.amount) {
      setAmountValue("");
      onFiltersChange({
        ...filters,
        amount: { type: "exact", value: null },
      });
    }

    if (!newFilters.includes("date") && filters.dateRange[0]) {
      onFiltersChange({
        ...filters,
        dateRange: [null, null],
      });
    }

    if (!newFilters.includes("createdBy") && filters.createdBy) {
      onFiltersChange({
        ...filters,
        createdBy: null,
      });
    }
  };

  return (
    <Stack gap="sm">
      <Group grow>
        <MultiSelect
          label="Filter By"
          placeholder="Select filters"
          data={[
            { value: "createdBy", label: "Created By" },
            { value: "date", label: "Date" },
            { value: "amount", label: "Amount" },
          ]}
          value={activeFilters}
          onChange={handleFilterChange}
          clearable
          searchable
        />
      </Group>

      {activeFilters.includes("createdBy") && (
        <Select
          label="Created By"
          placeholder="Select a user"
          data={uniqueUsers}
          value={filters.createdBy}
          onChange={(value) =>
            onFiltersChange({ ...filters, createdBy: value || null })
          }
          clearable
        />
      )}

      {activeFilters.includes("date") && (
        <>
          <Title order={5}>Filter By Date</Title>
          <Group>
            {Object.entries(presets).map(([key, preset]) => {
              const presetDates = preset.getValue();
              const isSelected =
                !showDatePicker &&
                filters.dateRange &&
                filters.dateRange[0] &&
                filters.dateRange[1] &&
                areDatesEqual(filters.dateRange[0], presetDates[0]) &&
                areDatesEqual(filters.dateRange[1], presetDates[1]);

              return (
                <Button
                  key={key}
                  variant={isSelected ? "filled" : "light"}
                  size="xs"
                  color="pink"
                  onClick={() => {
                    onFiltersChange({
                      ...filters,
                      dateRange: preset.getValue() as DatesRangeValue,
                    });
                    setShowDatePicker(false);
                  }}
                >
                  {preset.label}
                </Button>
              );
            })}
            <Button
              variant={showDatePicker ? "filled" : "light"}
              size="xs"
              color="pink"
              onClick={() => {
                setShowDatePicker(true);
                onFiltersChange({
                  ...filters,
                  dateRange: [null, null],
                });
              }}
            >
              Custom Range
            </Button>
            {showDatePicker && (
              <DatePickerInput
                type="range"
                size="xs"
                w={{ base: "100%", md: "auto" }}
                miw={200}
                placeholder="Pick dates"
                value={filters.dateRange}
                onChange={handleDateChange}
                clearable
              />
            )}
          </Group>
        </>
      )}

      {activeFilters.includes("amount") && (
        <Group align="flex-end">
          <SegmentedControl
            value={amountType}
            onChange={(value: string) => {
              setAmountType(value as AmountFilter["type"]);
              if (amountValue) {
                onFiltersChange({
                  ...filters,
                  amount: {
                    type: value as AmountFilter["type"],
                    value: Number(amountValue),
                  },
                });
              }
            }}
            data={[
              { label: "Exact", value: "exact" },
              { label: "Less than", value: "less" },
              { label: "Greater than", value: "greater" },
            ]}
          />
          <TextInput
            label="Amount"
            placeholder="Enter amount"
            value={amountValue}
            onChange={(e) => handleAmountChange(e.currentTarget.value)}
            type="number"
          />
        </Group>
      )}
    </Stack>
  );
}
