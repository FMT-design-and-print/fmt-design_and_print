import { Combobox, Input, TextInput, ScrollArea } from "@mantine/core";
import { useCombobox as mantineUseCombobox } from "@mantine/core";
import { useState, useMemo } from "react";
import { Town } from "@/types";
import placesInAccraData from "@/data/places-in-accra.json";

interface Props {
  value?: Town | null;
  onChange: (town: Town | null) => void;
  onDeliveryFeeCalculation?: (town: Town) => number;
  required?: boolean;
  regionId?: number;
}

export const TownCombobox = ({
  value,
  onChange,
  onDeliveryFeeCalculation,
  required = true,
  regionId,
}: Props) => {
  const combobox = mantineUseCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [searchValue, setSearchValue] = useState(value?.name || "");

  const townOptions = useMemo(() => {
    if (regionId === 7) {
      // Greater Accra
      const uniqueTownNames = new Set();

      return (placesInAccraData as Town[])
        .filter((place) =>
          place.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .filter((place) => {
          const townName = place.name.toLowerCase();
          if (!uniqueTownNames.has(townName)) {
            uniqueTownNames.add(townName);
            return true;
          }
          return false;
        })
        .map((place) => ({
          value: JSON.stringify(place),
          label: place.name,
        }));
    }
    return [];
  }, [regionId, searchValue]);

  return (
    <Input.Wrapper
      label="Town"
      description="If you can't find your exact town, please select the closest one to your location"
      required={required}
    >
      <Combobox
        store={combobox}
        onOptionSubmit={(value: string) => {
          const townData = JSON.parse(value) as Town;
          setSearchValue(townData.name);
          onChange(townData);

          if (onDeliveryFeeCalculation) {
            onDeliveryFeeCalculation(townData);
          }
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <TextInput
            placeholder="Search for your town"
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.currentTarget.value);
              combobox.openDropdown();
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            rightSection={<Combobox.Chevron />}
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <ScrollArea.Autosize type="scroll" mah={200}>
            <Combobox.Options>
              {townOptions.length > 0 ? (
                townOptions.map((item) => (
                  <Combobox.Option key={item.value} value={item.value}>
                    {item.label}
                  </Combobox.Option>
                ))
              ) : (
                <Combobox.Empty>No towns found</Combobox.Empty>
              )}
            </Combobox.Options>
          </ScrollArea.Autosize>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
};
