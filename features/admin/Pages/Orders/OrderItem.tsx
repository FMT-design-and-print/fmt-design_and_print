import { CopyIcon } from "@/components/CopyIcon";
import { IOrderItem } from "@/types/order";
import {
  Accordion,
  Avatar,
  Badge,
  Card,
  Divider,
  Group,
  Text,
} from "@mantine/core";
import { ArtworkFiles } from "./ArtworkFiles";
import { InstructionsViewer } from "./InstructionsViewer";
import { formatString } from "@/functions";
import { createClient } from "@/utils/supabase/client";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

interface Props {
  item: IOrderItem;
  orderId: string;
  onFileDeleted?: () => void;
}

export const OrderItem = ({ item, orderId, onFileDeleted }: Props) => {
  const [localItem, setLocalItem] = useState<IOrderItem>(item);

  const hasCustomizationDetails =
    localItem.isCustomizable &&
    ((localItem.artworkFiles && localItem.artworkFiles.length > 0) ||
      (localItem.artworkFilesMap &&
        Object.keys(localItem.artworkFilesMap).length > 0) ||
      localItem.instructions);

  // Handle file deletion by updating the order in the database
  const handleFileDeleted = async (fileInfo: {
    filePath: string;
    fileName: string;
    fileType: string;
    isInMap: boolean;
    mapLabel?: string;
    index: number;
  }) => {
    try {
      // Create a deep copy of the item to modify
      const updatedItem = JSON.parse(JSON.stringify(localItem)) as IOrderItem;

      // Update the appropriate file as deleted
      if (
        fileInfo.isInMap &&
        fileInfo.mapLabel &&
        updatedItem.artworkFilesMap
      ) {
        const filesMap = updatedItem.artworkFilesMap;
        if (
          filesMap[fileInfo.mapLabel] &&
          filesMap[fileInfo.mapLabel][fileInfo.index]
        ) {
          filesMap[fileInfo.mapLabel][fileInfo.index].isDeleted = true;
        }
      } else if (updatedItem.artworkFiles) {
        if (updatedItem.artworkFiles[fileInfo.index]) {
          updatedItem.artworkFiles[fileInfo.index].isDeleted = true;
        }
      }

      // Update local state first for immediate UI feedback
      setLocalItem(updatedItem);

      // Update the order in the database
      const supabase = createClient();
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (fetchError) {
        console.error("Error fetching order:", fetchError);
        notifications.show({
          title: "Error",
          message:
            "Could not update order in database. File is only deleted locally.",
          color: "orange",
        });
        return;
      }

      // Update the items array in the order
      const updatedItems = order.items.map((orderItem: IOrderItem) => {
        if (orderItem.id === localItem.id) {
          return updatedItem;
        }
        return orderItem;
      });

      // Save the updated order back to the database
      const { error: updateError } = await supabase
        .from("orders")
        .update({ items: updatedItems })
        .eq("id", orderId);

      if (updateError) {
        console.error("Error updating order:", updateError);
        notifications.show({
          title: "Error",
          message:
            "Could not update order in database. File is only deleted locally.",
          color: "orange",
        });
        return;
      }

      notifications.show({
        title: "Success",
        message: "File deletion saved to database",
        color: "green",
      });

      // Call the parent's onFileDeleted callback if provided
      if (onFileDeleted) {
        onFileDeleted();
      }
    } catch (error) {
      console.error("Error handling file deletion:", error);
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred while updating the order.",
        color: "red",
      });
    }
  };

  return (
    <Card withBorder my="sm">
      <Group gap="sm" wrap="nowrap">
        <Avatar size="lg" src={localItem.image} radius="xs" />

        <div style={{ flex: 1 }}>
          <Group gap={4}>
            {localItem.productNumber && (
              <>
                <Text c="gray.6" fw="bold" size="sm">
                  #{localItem.productNumber}
                </Text>
                <CopyIcon value={localItem.productNumber || ""} />
              </>
            )}
          </Group>

          <Text fz="sm" fw={500} lineClamp={2} mb="xs">
            {localItem.title}
          </Text>

          <Group wrap="wrap">
            {localItem.color && (
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Color:
                </Text>
                <Avatar src={localItem.color?.image} size="xs" />
              </Group>
            )}

            {localItem.size && (
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Size:
                </Text>
                <Text fz="xs" fw={500}>
                  {localItem.size}
                </Text>
              </Group>
            )}

            {localItem.selectedProductType && (
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Type:
                </Text>
                <Badge size="xs" color="pink">
                  {formatString(localItem.selectedProductType)}
                </Badge>
              </Group>
            )}

            <Group gap="5px">
              <Text fz="xs" c="dimmed">
                Quantity:
              </Text>
              <Text fz="xs" fw={500}>
                {localItem.quantity}
              </Text>
            </Group>

            <Group gap="5px">
              <Text fz="xs" c="dimmed">
                Price:
              </Text>
              <Text fz="xs" fw={500}>
                GHS {localItem.price * localItem.quantity}
              </Text>
            </Group>
          </Group>

          {localItem.note && (
            <Group mt="xs">
              <Text fz="xs" c="dimmed">
                Note:
              </Text>
              <Text fz="xs" style={{ fontStyle: "italic" }}>
                {localItem.note}
              </Text>
            </Group>
          )}
        </div>
      </Group>

      {hasCustomizationDetails && (
        <>
          <Divider my="sm" />
          <Accordion variant="contained">
            <Accordion.Item value="customization">
              <Accordion.Control>
                <Text size="sm" fw="bold">
                  Customization Details
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                {/* Artwork Files */}
                {((localItem.artworkFiles &&
                  localItem.artworkFiles.length > 0) ||
                  (localItem.artworkFilesMap &&
                    Object.keys(localItem.artworkFilesMap).length > 0)) && (
                  <ArtworkFiles
                    artworkFiles={localItem.artworkFiles}
                    artworkFilesMap={localItem.artworkFilesMap}
                    orderId={localItem.id}
                    onFileDeleted={handleFileDeleted}
                  />
                )}

                {/* Instructions */}
                {localItem.instructions && (
                  <InstructionsViewer instructions={localItem.instructions} />
                )}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </>
      )}
    </Card>
  );
};
