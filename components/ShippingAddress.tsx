import { regionsInGhana, visibleRegionIds } from "@/constants/gh-regions";
import placesInAccraData from "@/data/places-in-accra.json";
import { calculateDeliveryFeeFromDomeBranchByDistance } from "@/functions/calculateDeliveryFeeByDistance";
import { GHRegion, IShippingAddress, Town } from "@/types";
import { DeliveryType } from "@/types/order";
import {
  SimpleGrid,
  Select,
  Textarea,
  TextInput,
  Combobox,
  Input,
  useCombobox,
  ScrollArea,
} from "@mantine/core";
import React, { useState, useMemo } from "react";

interface Props {
  address: IShippingAddress;
  deliveryType?: DeliveryType;
  setDeliveryFee?: (fee: number) => void;
  update: (
    field: keyof IShippingAddress,
    value: string | number | GHRegion | Town | null | undefined
  ) => void;
}

export const ShippingAddress = ({
  address: { region, contactName, phone1, phone2, email, address, town },
  update,
  deliveryType,
  setDeliveryFee,
}: Props) => {
  const [searchValue, setSearchValue] = useState(town?.name || "");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  // Filter only visible regions
  const visibleRegions = regionsInGhana
    .filter((region) => visibleRegionIds.includes(region.id))
    .map((region) => ({
      value: region.id.toString(),
      label: region.name,
    }));

  // Filter towns based on selected region and search value
  const getTownsForRegion = useMemo(() => {
    if (region?.id === 7) {
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
  }, [region?.id, searchValue]);

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }}>
      <TextInput
        value={contactName}
        onChange={(e) => update("contactName", e.currentTarget.value)}
        label="Contact Name"
        placeholder="Ezra Nasir"
        required
      />

      <TextInput
        value={phone1}
        onChange={(e) => update("phone1", e.currentTarget.value)}
        label="Phone Number"
        placeholder="0555555555"
        required
      />

      <TextInput
        value={phone2}
        onChange={(e) => update("phone2", e.currentTarget.value)}
        label="Alternative Phone (Optional)"
        placeholder="0555555555"
      />

      <TextInput
        type="email"
        value={email}
        onChange={(e) => update("email", e.currentTarget.value)}
        label="Email Address (Optional)"
        placeholder="example@email.com"
      />

      {deliveryType === "delivery" && (
        <Select
          label="Region"
          description="At the moment, we only deliver to Greater Accra. Make a custom request if you need us to deliver to your region."
          placeholder="Select region"
          value={region?.id?.toString()}
          onChange={(value) => {
            const selectedRegion = regionsInGhana.find(
              (r) => r.id.toString() === value
            );
            update("region", selectedRegion || null);
            setSearchValue(""); // Reset search value when region changes
          }}
          data={visibleRegions}
          required
          allowDeselect={false}
        />
      )}

      {deliveryType === "delivery" && (
        <Input.Wrapper
          label="Town"
          description="If you can't find your exact town, please select the closest one to your location"
          required
        >
          <Combobox
            store={combobox}
            onOptionSubmit={(value: string) => {
              const townData = JSON.parse(value) as Town;
              setSearchValue(townData.name);
              update("town", townData);

              console.log(townData);
              if (setDeliveryFee) {
                const fee =
                  calculateDeliveryFeeFromDomeBranchByDistance(townData);
                console.log(fee);
                setDeliveryFee(fee);
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
                  {getTownsForRegion.length > 0 ? (
                    getTownsForRegion.map((item) => (
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
      )}

      {deliveryType === "delivery" && (
        <Textarea
          value={address}
          onChange={(e) => update("address", e.currentTarget.value)}
          label="Street Address"
          placeholder="Soko Park, Tantra Hills, Accra"
          required
        />
      )}
    </SimpleGrid>
  );
};
