import { ComboboxData, Select } from "@mantine/core";
import React from "react";

interface Props {
  label?: string;
  types: ComboboxData | undefined;
  defaultValue?: string | null;
  value?: string | null;
  onChange?: (value: string | null | undefined) => void;
}

export const ItemTypeSelect = ({
  label,
  types,
  defaultValue,
  value,
  onChange,
}: Props) => {
  return (
    <Select
      miw={250}
      defaultValue={defaultValue}
      label={label || "Item Type"}
      placeholder="Select type"
      data={types}
      value={value}
      onChange={onChange}
    />
  );
};
