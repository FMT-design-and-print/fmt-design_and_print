import { ComboboxData, Select } from "@mantine/core";
import React from "react";

interface Props {
  brands: ComboboxData | undefined;
  defaultValue?: string | null;
  value?: string | null;
  onChange?: (value: string | null | undefined) => void;
}

export const BrandSelect = ({
  brands,
  defaultValue,
  value,
  onChange,
}: Props) => {
  return (
    <Select
      miw={250}
      defaultValue={defaultValue}
      label="Brand"
      placeholder="Select brand"
      data={brands}
      value={value}
      onChange={onChange}
    />
  );
};
