/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TextEditor } from "@/components/TextEditor";
import {
  artworkOptionLabelMap,
  mapOrderDetailsKeyToLabel,
} from "@/constants/order-details-map";
import { useCustomReadOnlyEditor } from "@/hooks/useCustomEditor";
import { ArtworkOption } from "@/types";
import { Group, Paper, Stack, Text } from "@mantine/core";
import { FC } from "react";
import { v4 as uid } from "uuid";
import { FileDownloader } from "./FileDownloader";

interface Props {
  orderDetails: Record<string, any>;
}

const renderArtworks = (value: string[]) => {
  return (
    <Group pb="sm" key={uid()}>
      <Text size="sm">Artworks:</Text>
      {value.length === 0 ? (
        <Text size="sm" fw="bold">
          No artworks provided
        </Text>
      ) : (
        <FileDownloader fileNames={value} />
      )}
    </Group>
  );
};

const renderArtworkOption = (value: string) => (
  <Group pb="sm" key={uid()}>
    <Text size="sm">Artwork Option: </Text>
    <Text size="sm" fw="bold">
      {artworkOptionLabelMap[value as ArtworkOption]}
    </Text>
  </Group>
);

const renderOtherDetails = (
  key: string,
  value: any,
  mapOrderDetailsKeyToLabel: (key: string) => string
) => (
  <Group pb="sm" key={key}>
    <Text size="sm">{mapOrderDetailsKeyToLabel(key)}: </Text>
    <Text size="sm" fw="bold">
      {value}
    </Text>
  </Group>
);

export const CustomOrderDetailsRenderer: FC<Props> = ({ orderDetails }) => {
  const editor = useCustomReadOnlyEditor(orderDetails.instructions || "");
  return (
    <Paper withBorder p="lg" my="lg">
      {Object.entries(orderDetails).map(([key, value]) => {
        if (key === "instructions")
          return (
            <Stack key={key} my="lg">
              <Text size="sm">Design instructions:</Text>
              <TextEditor editor={editor} />
            </Stack>
          );

        if (key === "artworks") return renderArtworks(value);

        if (key === "artworkOption") return renderArtworkOption(value);

        return renderOtherDetails(key, value, mapOrderDetailsKeyToLabel);
      })}
    </Paper>
  );
};
