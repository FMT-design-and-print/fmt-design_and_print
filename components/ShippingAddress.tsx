import { calculateDeliveryFeeFromDomeBranchByDistance } from "@/functions/calculateDeliveryFeeByDistance";
import { GHRegion, IShippingAddress, Town } from "@/types";
import { DeliveryType } from "@/types/order";
import { SimpleGrid, TextInput, Textarea } from "@mantine/core";
import React from "react";
import { RegionSelect } from "./RegionSelect";
import { TownCombobox } from "./TownCombobox";

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
        <RegionSelect
          value={region?.id?.toString()}
          onChange={(selectedRegion) => update("region", selectedRegion)}
          required
          allowDeselect={false}
        />
      )}

      {deliveryType === "delivery" && (
        <TownCombobox
          value={town}
          onChange={(selectedTown) => {
            update("town", selectedTown);
            if (setDeliveryFee && selectedTown) {
              const fee =
                calculateDeliveryFeeFromDomeBranchByDistance(selectedTown);
              setDeliveryFee(fee);
            }
          }}
          regionId={region?.id}
          required
        />
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
