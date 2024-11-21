"use client";
import { Radio, Stack } from "@mantine/core";
import { useCustomRequest } from ".";
import { ArtworkOption } from "@/types";

export function ArtworkOptions() {
  const context = useCustomRequest();

  return (
    <Radio.Group
      defaultValue="own-artwork"
      value={context?.selectedArtworkOption}
      onChange={(value) =>
        context?.setSelectedArtworkOption(value as ArtworkOption)
      }
    >
      <Stack my="md">
        <Radio
          value="fmt-to-provide"
          label="I want FMT to create artwork for me"
          description="NB: This option means additional charges may apply "
          color="pink"
        />
        <Radio
          value="own-artwork"
          label="I will provide my own artwork"
          color="pink"
        />

        <Radio
          value="no-artwork-needed"
          label="I do not need artwork. It is just a regular text"
          color="pink"
        />
      </Stack>
    </Radio.Group>
  );
}
