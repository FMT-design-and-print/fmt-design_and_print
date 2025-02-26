import { Select, Text, Anchor } from "@mantine/core";
import Link from "next/link";
import { GHRegion } from "@/types";
import { regionsInGhana, visibleRegionIds } from "@/constants/gh-regions";

interface Props {
  value?: string;
  onChange: (region: GHRegion | null) => void;
  required?: boolean;
  allowDeselect?: boolean;
  showCustomRequestLink?: boolean;
  visibleRegionsOnly?: boolean;
}

export const RegionSelect = ({
  value,
  onChange,
  required = true,
  allowDeselect = false,
  showCustomRequestLink = true,
  visibleRegionsOnly = true,
}: Props) => {
  const regions = visibleRegionsOnly
    ? regionsInGhana.filter((region) => visibleRegionIds.includes(region.id))
    : regionsInGhana;

  const regionOptions = regions.map((region) => ({
    value: region.id.toString(),
    label: region.name,
  }));

  return (
    <Select
      label="Region"
      description={
        showCustomRequestLink ? (
          <Text size="xs" c="dimmed">
            At the moment, we only deliver to Greater Accra.{" "}
            <Anchor component={Link} href="/custom-request" size="xs" c="pink">
              Make a custom request
            </Anchor>{" "}
            if you need us to deliver to your region.
          </Text>
        ) : null
      }
      placeholder="Select region"
      value={value}
      onChange={(value) => {
        const selectedRegion = regionsInGhana.find(
          (r) => r.id.toString() === value
        );
        onChange(selectedRegion || null);
      }}
      data={regionOptions}
      required={required}
      allowDeselect={allowDeselect}
    />
  );
};
