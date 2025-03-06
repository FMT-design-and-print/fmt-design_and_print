/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TextEditor } from "@/components/TextEditor";
import {
  artworkOptionLabelMap,
  mapOrderDetailsKeyToLabel,
} from "@/constants/order-details-map";
import { useCustomReadOnlyEditor } from "@/hooks/useCustomEditor";
import { useUpdateCustomOrder } from "@/hooks/admin/useUpdateOrder";
import { ArtworkOption } from "@/types";
import { Group, Paper, Stack, Text } from "@mantine/core";
import { FC, useState } from "react";
import { v4 as uid } from "uuid";
import { FileDownloader } from "./FileDownloader";
import { notifications } from "@mantine/notifications";

interface Props {
  orderDetails: Record<string, any>;
  orderId?: string;
}

interface ArtworkFile {
  url: string;
  name: string;
  size?: number;
  type?: string;
  isDeleted?: boolean;
}

const renderArtworks = (
  value: string[],
  orderId?: string,
  onFilesUpdated?: (updatedFiles: (string | ArtworkFile)[]) => void
) => {
  // Check if any files are marked as deleted with #deleted suffix
  const hasDeletedFiles = value.some((file) => file.includes("#deleted"));

  return (
    <Group pb="sm" key={uid()}>
      <Text size="sm">Artworks:</Text>
      {value.length === 0 ? (
        <Text size="sm" fw="bold">
          No artworks provided
        </Text>
      ) : (
        <FileDownloader fileNames={value} onFilesUpdated={onFilesUpdated} />
      )}
      {hasDeletedFiles && (
        <Text size="xs" c="dimmed" fs="italic">
          Some files have been marked as deleted
        </Text>
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

export const CustomOrderDetailsRenderer: FC<Props> = ({
  orderDetails,
  orderId,
}) => {
  const editor = useCustomReadOnlyEditor(orderDetails.instructions || "");
  const [updatedOrderDetails, setUpdatedOrderDetails] = useState(orderDetails);
  const { mutate: updateCustomOrder } = useUpdateCustomOrder();

  // Handle file updates
  const handleFilesUpdated = async (updatedFiles: (string | ArtworkFile)[]) => {
    if (!orderId) return;

    try {
      // Create a new orderDetails object with the updated artworks
      const newOrderDetails = {
        ...updatedOrderDetails,
        artworks: updatedFiles,
      };

      // Update the state
      setUpdatedOrderDetails(newOrderDetails);

      // Update the order in the database
      updateCustomOrder({
        orderId,
        update: { orderDetails: newOrderDetails },
      });

      notifications.show({
        title: "Success",
        message: "Order details updated successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error updating order details:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update order details",
        color: "red",
      });
    }
  };

  return (
    <Paper withBorder p="lg" my="lg">
      {Object.entries(updatedOrderDetails).map(([key, value]) => {
        if (key === "instructions")
          return (
            <Stack key={key} my="lg">
              <Text size="sm">Design instructions:</Text>
              <TextEditor editor={editor} />
            </Stack>
          );

        if (key === "artworks")
          return renderArtworks(value, orderId, handleFilesUpdated);

        if (key === "artworkOption") return renderArtworkOption(value);

        return renderOtherDetails(key, value, mapOrderDetailsKeyToLabel);
      })}
    </Paper>
  );
};
